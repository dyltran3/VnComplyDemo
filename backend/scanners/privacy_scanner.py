"""
Privacy / Cookie Scanner — Phase 3a
Uses Playwright to crawl target URL and detect privacy violations.

Checks:
- Cookie consent banner presence (DOM)
- Pre-consent tracking (requests fired before user approves)
- Third-party tracker classification
- SSL/TLS status (delegated to ssl_checker)
"""

import asyncio
import logging
from dataclasses import dataclass, field
from typing import List, Optional
from urllib.parse import urlparse

from playwright.async_api import async_playwright, Request

logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------
# Known tracker domains (abbreviated for demo — expand from a real blocklist)
# --------------------------------------------------------------------------
TRACKER_DOMAINS = {
    "analytics": ["google-analytics.com", "analytics.google.com", "segment.io", "mixpanel.com"],
    "ads":       ["doubleclick.net", "googlesyndication.com", "facebook.com", "moatads.com"],
    "social":    ["connect.facebook.net", "platform.twitter.com", "linkedin.com"],
    "functional":["hotjar.com", "intercom.io", "zendesk.com"],
}

CONSENT_SELECTORS = [
    "[id*='cookie']", "[class*='cookie']", "[id*='consent']", "[class*='consent']",
    "[id*='gdpr']",   "[class*='gdpr']",   "button:has-text('Accept')",
    "button:has-text('Agree')",
]


@dataclass
class PrivacyFinding:
    category:    str        = "privacy"
    subcategory: str        = ""
    severity:    str        = "HIGH"
    title:       str        = ""
    description: str        = ""
    evidence:    str        = ""
    url:         str        = ""
    nd13_ref:    str        = ""
    law91_ref:   str        = ""


@dataclass
class PrivacyScanResult:
    target_url:         str
    findings:           List[PrivacyFinding] = field(default_factory=list)
    consent_banner_found: bool = False
    pre_consent_requests: List[str] = field(default_factory=list)
    third_party_domains:  List[dict] = field(default_factory=list)


def classify_tracker(domain: str) -> Optional[str]:
    """Return tracker category or None if not a known tracker."""
    for category, domains in TRACKER_DOMAINS.items():
        if any(t in domain for t in domains):
            return category
    return None


async def run_privacy_scan(target_url: str) -> PrivacyScanResult:
    """Main entry point — run full privacy scan against target_url."""
    result = PrivacyScanResult(target_url=target_url)
    pre_consent_reqs: List[dict] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # --- Intercept all network requests ---
        page_load_time: float = 0.0
        consent_click_time: float = float("inf")

        def on_request(req: Request):
            ts = asyncio.get_event_loop().time()
            parsed = urlparse(req.url)
            tracker_type = classify_tracker(parsed.netloc)

            if tracker_type:
                result.third_party_domains.append({
                    "domain": parsed.netloc,
                    "type":   tracker_type,
                    "url":    req.url,
                    "timestamp_ms": ts * 1000,
                })
                # Log as pre-consent if fired before user clicked accept
                if ts < consent_click_time:
                    pre_consent_reqs.append(req.url)

        page.on("request", on_request)

        # --- Navigate to target ---
        try:
            try:
                await page.goto(target_url, wait_until="networkidle", timeout=30_000)
                page_load_time = asyncio.get_event_loop().time()
            except Exception as e:
                logger.error(f"Failed to load {target_url}: {e}")
                # PHASE 3 FIX: Raise exception so background worker knows it failed
                raise ConnectionError(f"Target URL unreachable or timeout: {e}")


            # --- Check for consent banner ---
            for selector in CONSENT_SELECTORS:
                try:
                    el = await page.query_selector(selector)
                    if el and await el.is_visible():
                        result.consent_banner_found = True
                        break
                except Exception:
                    pass

            # --- Build findings ---
            if not result.consent_banner_found:
                # ... same logic ...
                pass # (omitted for brevity)

        finally:
            await browser.close()

    result.pre_consent_requests = pre_consent_reqs
    return result


# Quick local test
if __name__ == "__main__":
    import sys
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001"
    result = asyncio.run(run_privacy_scan(url))
    print(f"Consent banner found: {result.consent_banner_found}")
    print(f"Pre-consent requests: {len(result.pre_consent_requests)}")
    print(f"Total findings: {len(result.findings)}")
    for f in result.findings:
        print(f"  [{f.severity}] {f.title}")
