export function forceReflow(node: Element | null | undefined): void {
  if (node && "offsetHeight" in node) {
    void (node as HTMLElement).offsetHeight;
  }
}
