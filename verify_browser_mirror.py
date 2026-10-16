#!/home/rk/.venv_playwright/bin/python3
import time
from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            channel="chrome",
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = browser.new_page(viewport={"width": 1440, "height": 1100})

        print("[1] Navigating to BrowserMirror preview...")
        page.goto("http://localhost:4173/", wait_until="networkidle")

        print("[2] Waiting for deep diagnostic scan to complete...")
        page.wait_for_selector("text=Global Device Rarity", timeout=15000)

        # Verify hero elements
        title = page.title()
        print(f"[3] Page Title: '{title}'")

        content = page.content()
        assert "Global Device Rarity" in content, "Missing Global Device Rarity"
        assert "Shannon Entropy" in content, "Missing Shannon Entropy"
        assert "WebGL &amp; GPU Hardware Unmasking" in content or "WebGL & GPU Hardware Unmasking" in content, "Missing WebGL module"
        assert "AudioContext Acoustic Fingerprint" in content, "Missing Audio module"
        assert "Canvas 2D Geometric &amp; Text Entropy" in content or "Canvas 2D Geometric & Text Entropy" in content, "Missing Canvas module"
        assert "WebRTC &amp; Regional Edge Latency" in content or "WebRTC & Regional Edge Latency" in content, "Missing WebRTC module"
        assert "Hardware Architecture &amp; Display Telemetry" in content or "Hardware Architecture & Display Telemetry" in content, "Missing Hardware module"
        assert "Sub-Pixel System Font Enumeration" in content, "Missing Font module"
        assert "JavaScript Engine &amp; Precision Quirks" in content or "JavaScript Engine & Precision Quirks" in content, "Missing Quirks module"

        # Capture diagnostic screenshot
        screenshot_path = "/home/rk/.gemini/antigravity-cli/screenshots/browsermirror_verified.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"[4] Screenshot captured successfully to: {screenshot_path}")

        # Test Opening Defense Shield Modal
        print("[5] Testing Defense Shield Modal...")
        page.click("text=Remediate Leaks")
        page.wait_for_selector("text=Defense Shield: Remediation Matrix")
        shield_screenshot_path = "/home/rk/.gemini/antigravity-cli/screenshots/browsermirror_shield_modal.png"
        page.screenshot(path=shield_screenshot_path)
        print(f"[6] Defense Shield Screenshot captured: {shield_screenshot_path}")

        page.click("text=Close Matrix")

        # Test Opening Share Modal
        print("[7] Testing Export Audit Card Modal...")
        page.click("text=Export Audit Card")
        page.wait_for_selector("text=Export Privacy Scorecard")
        share_screenshot_path = "/home/rk/.gemini/antigravity-cli/screenshots/browsermirror_share_modal.png"
        page.screenshot(path=share_screenshot_path)
        print(f"[8] Share Modal Screenshot captured: {share_screenshot_path}")

        print("[+] ALL AUDIT MODULES & MODALS 100% VERIFIED GREEN!")
        browser.close()

if __name__ == "__main__":
    verify()
