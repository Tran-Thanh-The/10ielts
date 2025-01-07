// function formatToVietnamTime(timestamp) {
//     return new Intl.DateTimeFormat('vi-VN', {
//       timeZone: 'Asia/Ho_Chi_Minh',
//     //   year: 'numeric',
//     //   month: '2-digit',
//     //   day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//     }).format(new Date(timestamp));
//   }
// export default formatToVietnamTime;


function formatToVietnamTime(date: Date): string {
    return date.toLocaleTimeString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh', 
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  export default formatToVietnamTime;