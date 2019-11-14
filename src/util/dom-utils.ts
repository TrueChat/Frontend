export function isParent(maybeParent: Element, maybeChild: Element) : boolean {
  for (let i = 0; i < maybeParent.children.length; i++) {
    let child = maybeParent.children[i];
    if (child === maybeChild) {
      return true;
    } else {
      return isParent(child, maybeChild);
    }
  }
  return false;
}