let qrCode;

// Show / hide forms based on type
function changeForm() {
    const forms = ["textForm", "emailForm", "phoneForm", "whatsappForm", "wifiForm"];
    forms.forEach(f => document.getElementById(f).style.display = "none");
    const type = document.getElementById("qrType").value;
    document.getElementById(type + "Form").style.display = "block";
    updatePreview();
}

// Calculate brightness for contrast warning
function colorBrightness(hex) {
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Generate or update QR preview
function updatePreview() {
    const qrBox = document.getElementById("qrBox");
    qrBox.innerHTML = ""; // clear previous QR

    const qrFrame = document.getElementById("qrFrame");
    qrFrame.style.display = "flex"; // ensure visible

    const qrColorStart = document.getElementById("qrStartColor").value;
    const qrColorEnd = document.getElementById("qrEndColor").value;
    const bgColor = document.getElementById("bgColor").value;
    const dotType = document.getElementById("dotType").value;
    const frameType = document.getElementById("frameType").value;
    const logoInput = document.getElementById("logoInput");
    const qrLabel = document.getElementById("qrLabel");
    const labelText = document.getElementById("labelText");
    const warning = document.getElementById("warning");

    // Determine QR data
    const type = document.getElementById("qrType").value;
    let data = "";
    if (type === "text") data = document.getElementById("textInput").value;
    if (type === "email") data = `mailto:${document.getElementById("emailInput").value}?subject=${document.getElementById("emailSubject").value}`;
    if (type === "phone") data = `tel:${document.getElementById("phoneInput").value}`;
    if (type === "whatsapp") data = `https://wa.me/${document.getElementById("waNumber").value}?text=${encodeURIComponent(document.getElementById("waMessage").value)}`;
    if (type === "wifi") data = `WIFI:T:WPA;S:${document.getElementById("wifiName").value};P:${document.getElementById("wifiPass").value};;`;

    if (!data) return;

    // Contrast warning
    const diff = Math.abs(colorBrightness(qrColorStart) - colorBrightness(bgColor));
    warning.innerText = diff < 125 ? "⚠️ Low contrast colors may cause scan issues" : "";

    // QR options
    const options = {
        width: 280,
        height: 280,
        data: data,
        dotsOptions: {
            type: dotType,
            gradient: {
                type: "linear", rotation: 0, colorStops: [
                    { offset: 0, color: qrColorStart },
                    { offset: 1, color: qrColorEnd }
                ]
            }
        },
        backgroundOptions: { color: bgColor },
        qrOptions: { errorCorrectionLevel: logoInput.files[0] ? "H" : "M" }
    };

    if (logoInput.files[0]) {
        options.image = URL.createObjectURL(logoInput.files[0]);
        options.imageOptions = { margin: 10 };
    }

    qrCode = new QRCodeStyling(options);
    qrCode.append(qrBox);

    // Label text
    labelText.innerText = qrLabel.value;

    // Frame class
    qrFrame.className = "frame-" + frameType;
}

// Download PNG
function downloadPNG() {
    if (!qrCode) { alert("Generate QR first!"); return; }
    qrCode.download({ extension: "png" });
}

// Download SVG
function downloadSVG() {
    if (!qrCode) { alert("Generate QR first!"); return; }
    qrCode.download({ extension: "svg" });
}

// Optional: call updatePreview on page load to show default QR
window.onload = () => {
    changeForm();
};
