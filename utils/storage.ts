// utils/storage.ts
export const saveAddress = (entry: { name: string; address: string }) => {
  const existing = JSON.parse(localStorage.getItem("addresses") || "[]")
  existing.push(entry)
  localStorage.setItem("addresses", JSON.stringify(existing))
}

export const getAddresses = (): { name: string; address: string }[] => {
  return JSON.parse(localStorage.getItem("addresses") || "[]")
}
