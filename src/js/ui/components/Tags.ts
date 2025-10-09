const tagFromTemplate =
  (templateId: string) =>
  (props: { name: string; onClick: VoidFunction }): HTMLLIElement => {
    const template = document.getElementById(templateId) as HTMLTemplateElement;

    const fragment = document.importNode(template.content, true);

    const el = fragment.firstElementChild as HTMLLIElement;

    el.querySelector("button")!.innerText = props.name;

    el.addEventListener("click", props.onClick);

    return el;
  };

export const TagAppliance = tagFromTemplate("tag-appliance");
export const TagIngredient = tagFromTemplate("tag-ingredient");
export const TagUstensil = tagFromTemplate("tag-ustensil");
