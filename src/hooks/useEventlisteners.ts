import { useEffect } from "react";

export function useEventListneres({ setAddOpen }: any) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setAddOpen((open:any) => !open);
        // console.log("Custom Ctrl+S action triggered!");
      }
    };

    // To remove all option popups on clicked outside the area
    const handleOptionsPopup = (e: MouseEvent) => {
      // @ts-ignore
      let target = e?.target?.closest("td.action-table-data");
      if (target) {
        return
      }
      let actiontableDatas = document.querySelectorAll("td.action-table-data");
      actiontableDatas?.forEach(element => {
        element.classList.contains('active') ? element.classList.remove('active') : '';
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleOptionsPopup);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleKeyDown)
    };
  }, []);

}