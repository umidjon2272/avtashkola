export const today = () => new Date().toLocaleDateString('en-CA')
export const addDays = (date, n) => { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-CA') }
export const addMonths = (date, n) => { const d = new Date(`${date}T12:00:00`); if (isNaN(d)) return date; const originalDay=d.getDate(); d.setDate(1); d.setMonth(d.getMonth()+n); const lastDay=new Date(d.getFullYear(),d.getMonth()+1,0).getDate(); d.setDate(Math.min(originalDay,lastDay)); return d.toLocaleDateString('en-CA') }
export const nowDate = () => new Date().toISOString().slice(0, 10)
export const uid = (prefix='id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`
export const money = n => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Number(n)||0)
export const sum = rows => rows.reduce((a,b) => a + (Number(b)||0), 0)
export const dateLabel = date => { if (!date) return '—'; const d = new Date(`${date.slice(0,10)}T12:00:00`); return isNaN(d) ? '—' : new Intl.DateTimeFormat('uz-UZ', {day:'2-digit',month:'short',year:'numeric'}).format(d) }
export const STATUS = {active:'O‘qimoqda', paused:'To‘xtatilgan', graduated:'Bitirgan', withdrawn:'Ketgan', lead:'Yangi', waiting:'Navbatda'}
export const leadStatus = {new:'Yangi', contacted:'Bog‘lanildi', visited:'Tashrif buyurdi', enrolled:'O‘quvchi bo‘ldi', lost:'Rad etdi'}
export const paymentMethods = {cash:'Naqd', card:'Karta', transfer:'O‘tkazma', click:'Click/Payme'}
export function paidFor(db,studentId){ return sum(db.payments.filter(p=>p.studentId===studentId).map(p=>p.amount)) }
export function balance(db,s){ return Math.max(0, Number(s.fee||0)-paidFor(db,s.id)) }
export function groupOf(db,s){ return db.groups.find(g=>g.id===s.groupId) }
export function instructorOf(db,g){ return db.instructors.find(i=>i.id===g?.instructorId) }
export const getStudents = (db,gid) => db.students.filter(s=>s.groupId===gid && s.status==='active')
const t=today()
const students=[
 ['s1','Azizbek Karimov','+998 90 123 45 67','g1','active',4500000,3,'Telegram','B'],
 ['s2','Madina Ergasheva','+998 91 888 31 32','g1','active',4500000,2,'Instagram','B'],
 ['s3','Javohir Akbarov','+998 97 240 70 01','g1','active',4500000,1,'Tavsiya','B'],
 ['s4','Diyorbek Ismoilov','+998 93 102 11 20','g2','active',5000000,2,'Telegram','B'],
 ['s5','Nodira Qodirova','+998 90 612 88 77','g2','active',5000000,0,'Instagram','B'],
 ['s6','Akmal Rahimov','+998 99 021 15 11','g2','active',5000000,3,'Tavsiya','B'],
 ['s7','Oybek Sobirov','+998 94 224 00 02','g3','active',6200000,1,'Ofis','C'],
 ['s8','Dilshod Rasulov','+998 95 421 41 07','g3','active',6200000,2,'Telegram','C'],
 ['s9','Shahzoda Normatova','+998 90 890 20 11','g1','graduated',4500000,3,'Instagram','B'],
 ['s10','Hasanbek Ro‘ziyev','+998 93 441 77 31','g4','active',4500000,1,'Tavsiya','B'],
 ['s11','Murod Olimov','+998 97 321 40 87','g4','paused',4500000,1,'Telegram','B'],
 ['s12','Feruza Aliyeva','+998 91 220 52 22','g4','active',4500000,2,'Ofis','B'],
].map(([id,name,phone,groupId,status,fee,steps,source,category],i)=>({id,name,phone,groupId,status,fee,source,category, enrolledAt:addDays(t,-90+i*7),nextDue:addDays(t, i%4===0?-8:i%4===1?2:i%4===2?8:16),monthlyAmount:Math.round(fee/3),notes:'',passport:''}))
const payments=students.flatMap((s,i)=> Array.from({length: [3,2,1,2,0,3,1,2,3,1,1,2][i]},(_,j)=>({id:`pay-${i}-${j}`,studentId:s.id,amount: j===0?Math.round(s.fee*.3):j===1?Math.round(s.fee*.3):Math.round(s.fee*.4),date:addDays(t,-60+j*24+i),method:j%2?'card':'cash',note:j===0?'Boshlang‘ich to‘lov':''})))
export function demoData(){return structuredClone({version:1,settings:{schoolName:'AVTO MAKTAB',branch:'Toshkent · Chilonzor',phone:'+998 90 000 00 00',address:'Toshkent shahri',defaultFee:4500000,warningDays:7},
 students, payments,
 groups:[
  {id:'g1',name:'B-24 / Ertalab',category:'B',instructorId:'i1',schedule:'Du · Chor · Ju, 09:00',startDate:addDays(t,-54),endDate:addDays(t,36),capacity:20,fee:4500000,status:'active'},
  {id:'g2',name:'B-25 / Kechki',category:'B',instructorId:'i2',schedule:'Se · Pay · Sha, 18:30',startDate:addDays(t,-26),endDate:addDays(t,64),capacity:18,fee:5000000,status:'active'},
  {id:'g3',name:'C-08 / Kunduzgi',category:'C',instructorId:'i3',schedule:'Du · Chor · Ju, 14:00',startDate:addDays(t,-20),endDate:addDays(t,70),capacity:15,fee:6200000,status:'active'},
  {id:'g4',name:'B-26 / Dam olish',category:'B',instructorId:'i1',schedule:'Sha · Yak, 11:00',startDate:addDays(t,-10),endDate:addDays(t,82),capacity:18,fee:4500000,status:'active'},
 ],
 instructors:[{id:'i1',name:'Anvar Umarov',phone:'+998 90 431 20 11',category:'B',type:'Nazariya va amaliyot',status:'active'},{id:'i2',name:'Sardor Abdullayev',phone:'+998 93 333 01 24',category:'B',type:'Amaliyot',status:'active'},{id:'i3',name:'Farrux Ermatov',phone:'+998 97 700 25 26',category:'C',type:'Nazariya va amaliyot',status:'active'}],
 vehicles:[{id:'v1',model:'Chevrolet Cobalt',plate:'01 A 123 BC',category:'B',status:'available'},{id:'v2',model:'Chevrolet Onix',plate:'01 A 456 BC',category:'B',status:'available'},{id:'v3',model:'Isuzu NQR',plate:'01 A 789 BC',category:'C',status:'maintenance'}],
 lessons:[{id:'l1',studentId:'s1',groupId:'g1',instructorId:'i1',vehicleId:'v1',date:t,time:'10:00',duration:60,type:'practice',status:'planned',note:''},{id:'l2',studentId:'s2',groupId:'g1',instructorId:'i2',vehicleId:'v2',date:t,time:'11:30',duration:60,type:'practice',status:'planned',note:''},{id:'l3',studentId:'s4',groupId:'g2',instructorId:'i2',vehicleId:'v2',date:addDays(t,1),time:'16:00',duration:60,type:'practice',status:'planned',note:''}],
 attendance:[{id:'a1',studentId:'s1',groupId:'g1',date:addDays(t,-2),status:'present'},{id:'a2',studentId:'s2',groupId:'g1',date:addDays(t,-2),status:'present'},{id:'a3',studentId:'s3',groupId:'g1',date:addDays(t,-2),status:'absent'}],
 exams:[{id:'e1',studentId:'s9',type:'theory',date:addDays(t,-7),status:'passed',score:19},{id:'e2',studentId:'s3',type:'theory',date:addDays(t,10),status:'planned',score:''}],
 leads:[{id:'lead1',name:'Kamola Tursunova',phone:'+998 90 535 11 77',category:'B',source:'Instagram',status:'new',createdAt:addDays(t,-1),notes:'Kechki guruhga qiziqdi'},{id:'lead2',name:'Bobur Shermatov',phone:'+998 93 011 22 66',category:'B',source:'Telegram',status:'contacted',createdAt:addDays(t,-3),notes:'Narxni so‘radi'},{id:'lead3',name:'Suhrob Alimov',phone:'+998 91 840 44 72',category:'C',source:'Tavsiya',status:'visited',createdAt:addDays(t,-4),notes:''}],
 tasks:[{id:'task1',title:'Kamolaga qayta qo‘ng‘iroq',date:t,status:'open',studentId:'',priority:'high'},{id:'task2',title:'B-25 guruh to‘lovlarini tekshirish',date:addDays(t,1),status:'open',studentId:'',priority:'normal'}]
})}
export function normalizeData(raw){const d=demoData();if (!raw || typeof raw!=='object')return d; const result={...d,...raw};for(const k of ['students','payments','groups','instructors','vehicles','lessons','attendance','exams','leads','tasks']) if(!Array.isArray(result[k]))result[k]=d[k];return {...result,settings:{...d.settings,...result.settings},version:1}}
