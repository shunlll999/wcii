
const onClick = (event: React.MouseEvent<HTMLDivElement>, callback: () => void) => {
  // Prevent default link behavior
  event.preventDefault();

  // Handle the click event, e.g., navigate to a different page or perform an action
  console.log('Link clicked:', event.currentTarget.dataset.value);
  if (callback) {
    callback();
  }
}

export const navigationController = {
  onClick
};
