async function latexToPNG(latex, callback) {
  let scale = document.getElementById("resolution").value
  const container = document.getElementById("math-container");
  container.innerHTML = `\\(${latex}\\)`;

  // Wait for MathJax to render LaTeX to SVG
  await MathJax.typesetPromise([container]);

  const svg = container.querySelector("svg");
  if (!svg) {
    console.error("SVG not generated");
    return;
  }

  // Serialize SVG to string and convert to Blob URL
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function () {
    const canvas = document.getElementById("canvas");

    // Set canvas dimensions * scale
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext("2d");

    // Optional: Set higher quality for smoothing
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = "high";

    // Scale the drawing context
    ctx.scale(scale*0.8, scale*0.8);

    // Draw the image at original size but on scaled canvas
    ctx.drawImage(img, 0, 0);

    // Get high-res PNG
    const pngDataUrl = canvas.toDataURL("image/png");
    URL.revokeObjectURL(url);
    callback(pngDataUrl);

  };

  img.onerror = function () {
    console.error("Image failed to load");
    URL.revokeObjectURL(url);
  };

  img.src = url;
}


function generatePNG() {
  latexToPNG(regex(), function(pngUrl) {
    document.getElementById("output").src = pngUrl;
  });
  let scale = document.getElementById("resolution").value
  document.getElementById("output").width = 100
}

function regex() {
    input = document.getElementById("input").value
    output = input.replaceAll("\\", "•")
    console.log(output)
    output = output.replaceAll("•p{", "•text{")
    output = output.replaceAll("•f{", "•frac{")
    output = output.replaceAll("•Dt•", "•Delta")
    output = output.replaceAll("•Dt ", "•Delta")
    output = output.replaceAll("•dt•", "•delta")
    output = output.replaceAll("•dt ", "•delta")
    output = output.replaceAll("•br•", "•newline")
    output = output.replaceAll("•br ", "•newline")
    output = output.replaceAll("•", "\\")
    return output
}

console.log(regex())