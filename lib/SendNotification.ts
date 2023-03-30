import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ButtonStyle } from "@rocket.chat/apps-engine/definition/uikit";
import { IUser } from "@rocket.chat/apps-engine/definition/users";


export async function sendNotification(
    modify: IModify,
    room: IRoom,
    sender: IUser,
    message: string,
    threadId?: string,
): Promise<void> {
    let msg = modify.getCreator().startMessage()
        .setRoom(room)
        .setText(message);
    if(threadId !== undefined){
        msg.setThreadId(threadId)
    }
    // uncomment bellow if you want the notification to be sent by the sender
    // instead of the app bot user
    // msg = msg.setSender(sender);

    // lets build a really simple block (more on that on other Commands)
    const block = modify.getCreator().getBlockBuilder();
    // we want this block to have a Text supporting MarkDown
    block.addSectionBlock({
        text: block.newMarkdownTextObject(message),
    });

    block.addActionsBlock({
        elements: [
            block.newButtonElement({
                text: block.newPlainTextObject('⚡️ Copy to input box'),
                actionId: 'use_this_message',
                style: ButtonStyle.PRIMARY,
            }),
        ],
    })

    // now let's set the blocks in our message
    msg.setBlocks(block);
    // and finally, notify the user with the IMessage
    return await modify
        .getNotifier()
        .notifyUser(sender, msg.getMessage());
}
