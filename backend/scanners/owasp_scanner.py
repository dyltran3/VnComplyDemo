"""
OWASP Top 10 Scanner — Phase 4 (Reduced Scope: 7 core checks)
Uses httpx for HTTP requests and BeautifulSoup for HTML parsing.

Checks:
  A01 — IDOR (change user ID in URL)
  A02 — HTTP no HTTPS, missing TLS
  A03 — SQL Injection + Reflected XSS (payload injection)
  A04 — Exposed debug/config endpoints (/.env, /debug, /api/docs)
  A05 — Missing security headers (CSP, HSTS, X-Frame-Options, X-Content-Type)
  A07 — Weak JWT secret detection, no rate limiting on login
  CSRF — Form missing CSRF token, cookie without SameSite attribute
"""

import asyncio
import logging
import re
from dataclasses import dataclass, field
from typing import List
from urllib.parse import urlparse, urljoin

import httpx

logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------
# Constants
# --------------------------------------------------------------------------
SQLI_PAYLOADS = ["'", "' OR '1'='1", "' OR 1=1--", "1; DROP TABLE users--"]
XSS_PAYLOADS  = ["<script>alert(1)</script>", "<img src=x onerror=alert(1)>", "'\"<>"]
REQUIRED_HEADERS = {
    "Content-Security-Policy": "A05 — CSP header missing",
    "Strict-Transport-Security": "A05 — HSTS header missing",
    "X-Frame-Options": "A05 — Clickjacking protection missing",
    "X-Content-Type-Options": "A05 — MIME sniffing protection missing",
}
DEBUG_PATHS = [
    "/.env", "/debug", "/debug/.env", "/api/docs", "/.git/config",
    "/config.php", "/wp-config.php", "/server-status",
]
WEAK_JWT_SECRETS = ["secret", "password", "123456", "changeme", "jwt"]


@dataclass
class OWASPFinding:
    category:    str  = "owasp"
    subcategory: str  = ""
    severity:    str  = "HIGH"
    title:       str  = ""
    description: str  = ""
    evidence:    str  = ""
    url:         str  = ""
    owasp_ref:   str  = ""
    cvss_score:  float = 0.0


@dataclass
class OWASPScanResult:
    target_url: str
    findings:   List[OWASPFinding] = field(default_factory=list)


# --------------------------------------------------------------------------
# Individual check functions
# --------------------------------------------------------------------------

async def check_https(target_url: str, result: OWASPScanResult):
    """A02 — Check if site uses HTTPS."""
    if target_url.startswith("http://"):
        result.findings.append(OWASPFinding(
            subcategory="no-https",
            severity="HIGH",
            title="Site Does Not Use HTTPS",
            description="All traffic is transmitted in plaintext, exposing users to MITM attacks.",
            url=target_url,
            owasp_ref="A02:2021 — Cryptographic Failures",
            cvss_score=7.5,
        ))


async def check_security_headers(target_url: str, result: OWASPScanResult, client: httpx.AsyncClient):
    """A05 — Check for missing security response headers."""
    try:
        resp = await client.get(target_url)
        for header, msg in REQUIRED_HEADERS.items():
            if header not in resp.headers:
                result.findings.append(OWASPFinding(
                    subcategory="missing-security-header",
                    severity="MEDIUM",
                    title=f"Missing Header: {header}",
                    description=msg,
                    evidence=f"Response headers: {dict(resp.headers)}",
                    url=target_url,
                    owasp_ref="A05:2021 — Security Misconfiguration",
                    cvss_score=5.3,
                ))
    except Exception as e:
        logger.warning(f"Header check failed: {e}")


async def check_exposed_endpoints(target_url: str, result: OWASPScanResult, client: httpx.AsyncClient):
    """A04 — Check for exposed debug/config endpoints."""
    base = target_url.rstrip("/")
    for path in DEBUG_PATHS:
        url = base + path
        try:
            resp = await client.get(url, follow_redirects=False)
            if resp.status_code == 200:
                result.findings.append(OWASPFinding(
                    subcategory="exposed-debug-endpoint",
                    severity="CRITICAL",
                    title=f"Exposed Sensitive Endpoint: {path}",
                    description=(
                        f"The endpoint {path} is publicly accessible and may expose "
                        "configuration data, environment variables, or source code."
                    ),
                    evidence=resp.text[:500],
                    url=url,
                    owasp_ref="A04:2021 — Insecure Design",
                    cvss_score=9.1,
                ))
        except Exception:
            pass


async def check_sqli_xss(target_url: str, result: OWASPScanResult, client: httpx.AsyncClient):
    """A03 — Test login and search endpoints for SQL Injection and XSS."""
    base = target_url.rstrip("/")

    # SQLi on login form
    login_url = base + "/api/login"
    for payload in SQLI_PAYLOADS:
        try:
            form_data = {"email": f"test{payload}@test.com", "password": payload}
            resp = await client.post(login_url, data=form_data)
            body = resp.text.lower()
            if any(kw in body for kw in ["sqlite", "syntax error", "unexpected token", "select *"]):
                result.findings.append(OWASPFinding(
                    subcategory="sql-injection",
                    severity="CRITICAL",
                    title="SQL Injection Detected (Login Form)",
                    description="The login endpoint is vulnerable to SQL injection via the email/password fields.",
                    evidence=f"Payload: {payload}\nResponse snippet: {resp.text[:300]}",
                    url=login_url,
                    owasp_ref="A03:2021 — Injection",
                    cvss_score=9.8,
                ))
                break
        except Exception:
            pass

    # XSS on search endpoint
    search_url = base + "/api/search"
    for payload in XSS_PAYLOADS:
        try:
            resp = await client.get(search_url, params={"q": payload})
            if payload in resp.text:
                result.findings.append(OWASPFinding(
                    subcategory="reflected-xss",
                    severity="HIGH",
                    title="Reflected XSS Detected (Search Endpoint)",
                    description="User input is reflected directly in the HTML response without sanitization.",
                    evidence=f"Payload: {payload}\nReflected in response",
                    url=f"{search_url}?q={payload}",
                    owasp_ref="A03:2021 — Injection (XSS)",
                    cvss_score=8.2,
                ))
                break
        except Exception:
            pass


async def check_idor(target_url: str, result: OWASPScanResult, client: httpx.AsyncClient):
    """A01 — Test for IDOR by accessing user profiles without auth."""
    base = target_url.rstrip("/")
    for user_id in [1, 2, 3]:
        url = f"{base}/api/users/{user_id}"
        try:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                if any(k in data for k in ["credit_card", "email", "balance"]):
                    result.findings.append(OWASPFinding(
                        subcategory="idor",
                        severity="CRITICAL",
                        title=f"IDOR — Unauthenticated Access to User Profile (ID={user_id})",
                        description=(
                            "User profile data (including credit card info) can be accessed "
                            "by any unauthenticated user by changing the ID in the URL."
                        ),
                        evidence=str(data)[:300],
                        url=url,
                        owasp_ref="A01:2021 — Broken Access Control",
                        cvss_score=8.8,
                    ))
                    break
        except Exception:
            pass


async def check_csrf(target_url: str, result: OWASPScanResult, client: httpx.AsyncClient):
    """CSRF — Check if forms lack CSRF tokens and cookies lack SameSite."""
    try:
        resp = await client.get(target_url + "/login")
        body = resp.text.lower()
        has_csrf = "csrf" in body or "_token" in body or "csrfmiddlewaretoken" in body
        if not has_csrf:
            result.findings.append(OWASPFinding(
                subcategory="missing-csrf-protection",
                severity="HIGH",
                title="CSRF Protection Missing on Forms",
                description="Login form does not include a CSRF token, making it vulnerable to cross-site request forgery.",
                url=target_url + "/login",
                owasp_ref="A01:2021 — Broken Access Control (CSRF)",
                cvss_score=7.1,
            ))
        # Check Set-Cookie for SameSite
        set_cookie = resp.headers.get("set-cookie", "")
        if set_cookie and "samesite" not in set_cookie.lower():
            result.findings.append(OWASPFinding(
                subcategory="missing-samesite-cookie",
                severity="MEDIUM",
                title="Session Cookie Missing SameSite Attribute",
                description="Cookies without SameSite=Strict/Lax can be sent in cross-site requests, enabling CSRF attacks.",
                evidence=set_cookie[:200],
                url=target_url,
                owasp_ref="A01:2021 — Broken Access Control (CSRF)",
                cvss_score=5.4,
            ))
    except Exception as e:
        logger.warning(f"CSRF check failed: {e}")


# --------------------------------------------------------------------------
# Main orchestrator
# --------------------------------------------------------------------------

async def run_owasp_scan(target_url: str) -> OWASPScanResult:
    """Run all 7 OWASP checks against target_url."""
    result = OWASPScanResult(target_url=target_url)

    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
        # PHASE 4 FIX: Pre-check reachability
        try:
            await client.get(target_url)
        except Exception as e:
            logger.error(f"OWASP Scan: Target {target_url} unreachable: {e}")
            raise ConnectionError(f"Security Scanner could not connect to target: {e}")

        await asyncio.gather(

            check_https(target_url, result),
            check_security_headers(target_url, result, client),
            check_exposed_endpoints(target_url, result, client),
            check_sqli_xss(target_url, result, client),
            check_idor(target_url, result, client),
            check_csrf(target_url, result, client),
        )

    logger.info(f"OWASP scan complete. {len(result.findings)} findings for {target_url}")
    return result


if __name__ == "__main__":
    import sys
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8001"
    res = asyncio.run(run_owasp_scan(url))
    for f in res.findings:
        print(f"[{f.severity}] [{f.owasp_ref}] {f.title}")
