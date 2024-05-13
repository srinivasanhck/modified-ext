import util from "@extension_util/Util";

export const state = {};

export async function window_send_message(where: string,message: string,data: any = null) {
  // console.log("window send",where,message,data);
  return await util.windows[where].exec(message,JSON.parse(JSON.stringify(data))
  );
}


export function main(state: any, action: any) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
  }
}
