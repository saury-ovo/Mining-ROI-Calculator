"""One-click launcher for the packaged ASIC ROI Analyzer desktop demo."""

import socket
import sys
import threading
import time
import webbrowser
from pathlib import Path

from werkzeug.serving import make_server


def _resource_root():
    """Return the bundled resource directory in source and PyInstaller modes."""
    if getattr(sys, "frozen", False):
        return Path(getattr(sys, "_MEIPASS", Path(sys.executable).parent))
    return Path(__file__).resolve().parent


def _find_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def _show_error(message):
    try:
        import ctypes

        ctypes.windll.user32.MessageBoxW(0, message, "ASIC ROI Analyzer", 0x10)
    except Exception:
        print(message, file=sys.stderr)


def main():
    try:
        root = _resource_root()
        if not (root / "templates").is_dir() or not (root / "static").is_dir():
            raise RuntimeError("Packaged templates or static resources are missing.")

        from app import app

        port = _find_port()
        server = make_server("127.0.0.1", port, app, threaded=True)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        url = f"http://127.0.0.1:{port}/"

        for _ in range(50):
            try:
                with socket.create_connection(("127.0.0.1", port), timeout=0.2):
                    break
            except OSError:
                time.sleep(0.1)
        else:
            raise RuntimeError("The local web server did not start.")

        webbrowser.open(url)
        thread.join()
    except Exception as error:
        _show_error(f"Unable to start ASIC ROI Analyzer.\n\n{error}")
        raise


if __name__ == "__main__":
    main()
