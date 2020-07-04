import { replaceQRSubmit } from './quickReply';

import cryingWojak from '../assets/crying_wojak.png';

const quoteColor = '#789922';
const bgColor = '#ffffff';

declare global {
  interface Window { imageData: string; }
  interface QR {
    submit: Function;
    xhr: any;
  }
}
window.imageData = '';

const onButtonClick = (postText: string) => {
  const image = new Image();

  image.src = cryingWojak as unknown as string;

  const canvas = document.createElement('canvas');
  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height + 100;
    const ctx = canvas.getContext('2d');

    ctx.font = '48px serif';
    let lines = countLines(ctx, postText, image.width);
    canvas.height = canvas.height + (lines + 2) * 48;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '48px serif';
    ctx.fillStyle = quoteColor;
    wrapText(ctx, postText, 0, image.height + 100, image.width, 48);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0);

    let data = canvas.toDataURL();
    window.imageData = data;
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
      context.font = '48px serif';
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

const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
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

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
};

const setFile = (t: any) => { //type of t is hidden somewhere in the minified QR code 
  if(window.imageData) {
    console.log('test', t)
    t.set("upfile", new File([b64toBlob(window.imageData.substring(22))], "you.png"));
    window.imageData = null;
  }
};

const createButton = (box: Element, postText: string, buttonText: string, onClick: (text: string) => void) => {
  const button = document.createElement('button', {

  });
  button.textContent = buttonText;
  button.setAttribute('style', 'cursor: pointer;');
  button.addEventListener("click", e => { e.preventDefault(), onClick(`>${postText}`); });
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
    }
  }
}

findPosts();
replaceQRSubmit(setFile);