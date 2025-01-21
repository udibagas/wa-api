import fs from "fs";
import { createCanvas } from "canvas";

const width = 300;
const height = 300;
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

// Fill the background with a color
context.fillStyle = "#000000";
context.fillRect(0, 0, width, height);

// Draw some text
context.fillStyle = "#ffffff";
context.font = "24px Arial";
const text = "Dummy Image";
const textWidth = context.measureText(text).width;
const x = (width - textWidth) / 2;
const y = (height + 24) / 2; // 24 is the font size
context.fillText(text, x, y);

// Save the image to a file
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("images/dummy.png", buffer);

console.log("Dummy image created as dummy.png");
