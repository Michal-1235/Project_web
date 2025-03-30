import Message from "./Message";
  
function EmptyMessageList() {
    return <div className="row">
            <div className="col">
              <div className="py-3">
                  No messages yet
              </div>
            </div>
          </div>;
  }


function MessageList({messages}) {
    let messageList = messages.map((message) => <Message key={message.id} message={message}></Message>);
    let emptyMessageList =  <EmptyMessageList></EmptyMessageList>;  
  
    return messageList.length>0 ? messageList : emptyMessageList;
  }

export { MessageList };