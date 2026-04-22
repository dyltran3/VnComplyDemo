"""
SSL / TLS Checker — Phase 3a (sub-module)
Checks SSL certificate validity, TLS version, and HSTS.
"""

import asyncio
import logging
import ssl
import socket
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

import httpx

logger = logging.getLogger(__name__)


@dataclass
class SSLResult:
    url:           str
    is_https:      bool = False
    cert_valid:    bool = False
    cert_expiry:   Optional[str] = None
    days_to_expiry: int = 0
    tls_version:   Optional[str] = None
    hsts_present:  bool = False
    findings:      list = field(default_factory=list)


async def check_ssl(target_url: str) -> SSLResult:
    """Run SSL/TLS checks on target_url."""
    result = SSLResult(url=target_url, is_https=target_url.startswith("https://"))

    if not result.is_https:
        result.findings.append({
            "severity": "HIGH",
            "title": "Site Does Not Use HTTPS",
            "description": "All data is transmitted in plaintext.",
            "nd13_ref": "NĐ13/2023 — Điều 26 (bảo mật kỹ thuật trong xử lý dữ liệu)",
        })
        return result

    from urllib.parse import urlparse
    parsed = urlparse(target_url)
    host = parsed.hostname
    port = parsed.port or 443

    # Check certificate
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, port), timeout=10) as sock:
            with ctx.wrap_socket(sock, server_hostname=host) as ssock:
                cert = ssock.getpeercert()
                tls_ver = ssock.version()
                result.tls_version = tls_ver
                result.cert_valid = True

                # Expiry check
                expiry_str = cert.get("notAfter", "")
                if expiry_str:
                    expiry_dt = datetime.strptime(expiry_str, "%b %d %H:%M:%S %Y %Z")
                    result.cert_expiry = expiry_dt.strftime("%Y-%m-%d")
                    result.days_to_expiry = (expiry_dt - datetime.utcnow()).days
                    if result.days_to_expiry < 30:
                        result.findings.append({
                            "severity": "MEDIUM",
                            "title": f"SSL Certificate Expiring Soon ({result.days_to_expiry} days)",
                            "description": f"Certificate expires on {result.cert_expiry}.",
                        })

                # TLS version check
                if tls_ver in ("TLSv1", "TLSv1.1"):
                    result.findings.append({
                        "severity": "HIGH",
                        "title": f"Outdated TLS Version: {tls_ver}",
                        "description": "TLS 1.0 and 1.1 are deprecated and insecure. Upgrade to TLS 1.2+.",
                        "owasp_ref": "A02:2021 — Cryptographic Failures",
                    })
    except ssl.SSLCertVerificationError:
        result.cert_valid = False
        result.findings.append({
            "severity": "CRITICAL",
            "title": "Invalid SSL Certificate",
            "description": "The SSL certificate is invalid, self-signed, or the chain is broken.",
        })
    except Exception as e:
        logger.warning(f"SSL check failed for {target_url}: {e}")

    # Check HSTS header
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(target_url)
            if "Strict-Transport-Security" in resp.headers:
                result.hsts_present = True
            else:
                result.findings.append({
                    "severity": "MEDIUM",
                    "title": "HSTS Header Missing",
                    "description": "Strict-Transport-Security header not set, allowing downgrade attacks.",
                    "owasp_ref": "A05:2021 — Security Misconfiguration",
                })
    except Exception:
        pass

    return result


if __name__ == "__main__":
    import sys
    url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
    res = asyncio.run(check_ssl(url))
    print(f"HTTPS: {res.is_https}, Valid cert: {res.cert_valid}, TLS: {res.tls_version}")
    print(f"Expires: {res.cert_expiry} ({res.days_to_expiry} days)")
    for f in res.findings:
        print(f"  [{f['severity']}] {f['title']}")
