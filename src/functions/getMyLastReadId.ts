import { MessageGet } from "../definitions/messages"

export default (messages: MessageGet[], userId: string) => {
    return messages.reduce((lastReadMessage, message) => {
        return message.readBy.includes(userId) ? message.id : lastReadMessage
    }, 0)        
}