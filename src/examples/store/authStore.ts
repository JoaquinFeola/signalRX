import { createObserver } from "../../Core/utils/observer";

export const listObserver = createObserver(
  {
    list: [] as { title: string }[],
  },
  true
);


export const addToList = (listItem: { title: string }) => {
  if (listItem.title.trim().length <= 0) return;

  listObserver.setData(prev => ({
    ...prev,
    list: [...prev.list, listItem]
  }))
}
export const quitFromList = (index: number) => {

  listObserver.setData(prev => ({
    ...prev,
    list: prev.list.filter((_, i) => i !== index)
  }))
}