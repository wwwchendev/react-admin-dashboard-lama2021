//載入模組順序
//✅載入元件


//✅頁面元件
//->建立實例
//->取得Token
//->取得redux資料
//->初始化頁面內容
useEffect(() => {
  setCurrentPage('/employee/changePassword');
}, []);
//->狀態管理
//-->表單管理
const [formInput, setformInput] = useState({
  employeeId: '',
  password: '',
});
//->監聽修改 handle[Target]Form[Status]Change
//->監聽提交 handle[Target]Form[Status]Submit
//->檢視資料 handle[Target]Click(id)
//->顯示表單內容 show[Target]FormData(id)
//->建立資料 handle[Target]Create
//->刪除資料 handle[Target]Delete(id)
//->更新資料 handle[Target]Edit(id)

//->顯示元件 show[Target]Element(Boolean)
//->產生器 generate[Object]

//✅元件
//不要在標籤上設置style屬性
