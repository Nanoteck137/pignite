export function handleModalOutsideClick(
  e: React.MouseEvent<HTMLDialogElement, MouseEvent>,
) {
  if (e.currentTarget.tagName !== "DIALOG")
    //This prevents issues with forms
    return;

  const rect = e.currentTarget.getBoundingClientRect();

  const clickedInDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (clickedInDialog === false) e.currentTarget.close();
}
