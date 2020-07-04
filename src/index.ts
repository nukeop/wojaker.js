import { replaceQRSubmit } from './quickReply';
import { createDropdown } from './dropdown';

import cryingWojak from '../assets/crying_wojak.png';
import cryingSoyjak from '../assets/crying_soyjak.jpg';
import npcWojak from '../assets/npc_wojak.png';

const quoteColor = '#789922';
const bgColor = '#ffffff';
const font = '40px Arial';

const imageWidth = 600;

export type ReactionImage = {
  name: string;
  src: string;
};

const reactionImages: ReactionImage[] = [
  { name: 'Crying Wojak', src: cryingWojak },
  { name: 'Crying Soyjak', src: cryingSoyjak },
  { name: 'NPC Wojak', src: npcWojak }
];

declare global {
  interface Window { 
    imageData: string; 
    selectedReactionImage: string;
  }
  interface QR {
    submit: Function;
    xhr: any;
  }
}
window.imageData = '';
window.selectedReactionImage = cryingWojak;

const onButtonClick = (postText: string, button: Element) => {
  const image = new Image();

  image.src = window.selectedReactionImage;

  const canvas = document.createElement('canvas');
  image.onload = () => {
    const imageHeight = imageWidth * (image.height / image.width);
    canvas.width = imageWidth;
    canvas.height = imageHeight + 100;
    const ctx = canvas.getContext('2d');

    ctx.font = font;
    let lines = countLines(ctx, postText, imageWidth);
    canvas.height = canvas.height + (lines + 2) * 48;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = font;
    ctx.fillStyle = quoteColor;
    wrapText(ctx, postText, 0, imageHeight + 100, imageWidth, 48);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, imageWidth, imageHeight);

    let data = canvas.toDataURL();
    window.imageData = data;

    button.textContent = 'Wojakified'
  };
}

const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  var words = text.split(' ');
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.font = font;
      context.fillStyle = quoteColor;

      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

const countLines = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  let words = text.split(' ');
  let linesN = 0;
  let line = '';

  for (let i = 0; i < words.length; i++) {
    line += ' ' + words[i];
    let metrics = context.measureText(line);
    if (metrics.width > maxWidth) {
      linesN++;
      line = '';
    }
  }

  return linesN;
}

const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

const setFile = (t: any) => { //type of t is hidden somewhere in the minified QR code 
  if (window.imageData) {
    console.log('test', t)
    t.set("upfile", new File([b64toBlob(window.imageData.substring(22))], "you.png"));
    window.imageData = null;
  }
};

const createButton = (
  box: Element,
  postText: string,
  buttonText: string,
  onClick: (text: string, button: Element) => void
) => {
  const button = document.createElement('button', {});
  button.textContent = buttonText;
  button.setAttribute('style', 'cursor: pointer;');
  button.addEventListener("click", e => { e.preventDefault(), onClick(`>${postText}`, button); });
  box.append(button);
}

const findPosts = () => {
  const posts = document.getElementsByClassName('replyContainer');
  for (let post in posts) {
    if (!(posts[post]).getElementsByTagName) {
      continue;
    }

    const boxWT = posts[post].getElementsByClassName('post reply')[0];
    const box = posts[post].querySelectorAll('.postInfo')[0];

    if (box) {
      const postText = boxWT.getElementsByTagName('blockquote')[0].innerText;
      createButton(box, postText, 'Wojakify', onButtonClick);
      createDropdown(box, reactionImages);
    }
  }
}

findPosts();
replaceQRSubmit(setFile);