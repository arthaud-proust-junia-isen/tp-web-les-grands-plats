export const SearchItem = (props: {
  name: string;
  onRemove: (e: Event) => void;
}): HTMLDivElement => {
  const template = document.getElementById(
    "search-item",
  ) as HTMLTemplateElement;

  const fragment = document.importNode(template.content, true);

  const el = fragment.firstElementChild as HTMLDivElement;

  const nameEl = el.querySelector(".search-item-name") as HTMLSpanElement;
  nameEl.innerText = props.name;

  const btnEl = el.querySelector(".search-item-remove") as HTMLButtonElement;
  btnEl.addEventListener("click", props.onRemove);

  return el;
};
