import { ReactionImage } from '.';

export const createDropdown = (
  box: Element,
  reactionImages: ReactionImage[]
) => { 
  const dropdown = document.createElement('select');
  dropdown.textContent = reactionImages[0].name;
  reactionImages.forEach(image => {
    const option = document.createElement('option');
    option.textContent = image.name;
    option.value = image.name;
    dropdown.appendChild(option);
  });

  dropdown.onchange = (e: Event) => {
    let target = e.target as HTMLSelectElement;
    let selectedImage = reactionImages[target.selectedIndex];
    console.log(selectedImage)
    window.selectedReactionImage = selectedImage.src;
  }

  box.append(dropdown);
}