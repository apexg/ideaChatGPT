import styles from "./stat.module.scss";
import Locale, { AllLangs, ALL_LANG_OPTIONS, Lang } from "../locales";
import { useEffect, useState,useRef } from "react";

const base_url= process.env.NEXT_PUBLIC_AUTH_WECHAT_REDIRECT_URI
export function Stat() {
  const statTime = useRef(5);
  const [statList, setStatList] = useState({
    userCnt: 0,
    questCnt: 0,
    quests: [
      { alias_name :'',
      count:0, 
      latest_request_time:''
    },
    
    ],
  });
  
  const getStatTime = (evt: any) => {
    let recentMinutes = 1;
    if (typeof evt === "number") {
      recentMinutes = evt;
    } else if (evt) {
      recentMinutes = parseInt(evt.currentTarget.value);
      evt.currentTarget.blur();
      statTime.current = recentMinutes;
    } else {
      recentMinutes = statTime.current;
    }
    return recentMinutes * 60 * 1000;
  };
  
  async function getStat(evt?: any){
    const statTime = getStatTime(evt);   

    // 定义请求的 URL
    const url = `${base_url}/api/users/stat`;
    // 准备请求的数据
    const data = {
      period:statTime,
      corpid:process.env.NEXT_PUBLIC_AUTH_WECHAT_APP_ID      
    };
    // console.log("请求data",data)
    // 配置 Fetch 请求
    const options = {
      method: 'POST',  // 指定请求方法为 POST
      headers: {
        'Content-Type': 'application/json'  // 指定请求头为 JSON 格式
      },
      body: JSON.stringify(data)  // 将数据转换为 JSON 字符串
    };

    // 发起 Fetch 请求
    const res= await fetch(url, options)
    const result = await res.json()
    const userCnt = result.data.length;
    const questCnt = result.data.reduce(
            (acc: string, curr: any) => parseInt(acc) + parseInt(curr.count),
            0,
          );

    setStatList({ userCnt, questCnt, quests: result.data });
  }
  function TimeDurationSelect(props: {
    statTime?: number;
    onChange?: (evt: any) => void;
    onClick?: () => void;
  }) {
    return (
      <select
        onChange={props?.onChange}
        
        value={props?.statTime}
      >
        <option value={1}>1 {Locale.Stat.StatFilterMinute}</option>
        <option value={5}>5 {Locale.Stat.StatFilterMinute}</option>
        <option value={10}>10 {Locale.Stat.StatFilterMinute}</option>
        <option value={30}>30 {Locale.Stat.StatFilterMinute}</option>
        <option value={60}>1 {Locale.Stat.StatFilterHour}</option>
        <option value={1440}>1 {Locale.Stat.StatFilterDay}</option>
        <option value={7200}>5 {Locale.Stat.StatFilterDay}</option>
        <option value={10080}>7 {Locale.Stat.StatFilterDay}</option>
        <option value={43200}>30 {Locale.Stat.StatFilterDay}</option>
      </select>
    );
  }

  useEffect(() => {
    getStat()    
  }, []);

  return (
    <div className={styles["stat-list"]}>
      <div className={styles["stat-list-title"]}>
      {Locale.Stat.Title}
      </div>
      <div className={styles["stat-list-filter"]}>
              <div>
                {Locale.Stat.StatFilterLabel}
                <TimeDurationSelect
                 statTime={statTime.current}
                 onChange={getStat}                 
                />
              </div>
              <div>{Locale.Stat.OnlineCount(statList.userCnt)}</div>
              <div>{Locale.Stat.MsgCount(statList.questCnt)}</div>
      </div>
      <div className={styles["stat-list-data"]}>
            <table>
              <thead>
                <tr>
                  <th>{Locale.Stat.No}</th>
                  <th>{Locale.Stat.StatNameColName}</th>
                  <th>{Locale.Stat.StatAskTimeColName}</th>
                  <th>{Locale.Stat.StatMsgCountColName}</th>
                </tr>
              </thead>
              <tbody>
                {statList.quests.map(({ alias_name, count, latest_request_time }, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{alias_name}</td>
                    <td>{latest_request_time}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>{Locale.Stat.StatTotalColName}</td>
                  <td></td>
                  <td></td>
                  <td>{statList.questCnt}</td>
                </tr>
              </tfoot>
            </table>
          </div>
    </div> 
  );
}
