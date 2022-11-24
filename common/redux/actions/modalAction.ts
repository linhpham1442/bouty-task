import { getTypeOpenModal, getTypeCloseModal } from '../utils'

export const openModal = (type: string, data = {}) => {
  return { type: getTypeOpenModal(type), payload: { data, open: true, key: new Date().getTime() } }
}

export const closeModal = (type: string) => {
  return { type: getTypeCloseModal(type), payload: { data: null as any, open: false, action: null as any } }
}
