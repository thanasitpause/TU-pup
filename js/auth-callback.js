// ไฟล์ js/auth-callback.js
// จัดการการ callback จาก Google OAuth

// เมื่อหน้าเว็บโหลด
document.addEventListener('DOMContentLoaded', async function() {
    // แสดงข้อความกำลังตรวจสอบ
    const messageContainer = document.getElementById('message-container');
    
    if (messageContainer) {
      messageContainer.textContent = 'กำลังตรวจสอบการเข้าสู่ระบบ...';
    }
    
    try {
      // ตรวจสอบว่ามีการล็อกอินด้วย OAuth หรือไม่
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      // ถ้าผู้ใช้ล็อกอินแล้ว
      if (data?.session?.user) {
        const user = data.session.user;
        
        // เก็บข้อมูลชื่อที่แสดงใน user_metadata ถ้ายังไม่มี
        if (!user.user_metadata?.display_name) {
          // ใช้ชื่อจาก Google หรือส่วนแรกของอีเมล
          const displayName = user.user_metadata?.full_name || 
                             user.user_metadata?.name || 
                             user.email.split('@')[0];
          
          // อัปเดต metadata ให้มี display_name
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              display_name: displayName
            }
          });
          
          if (updateError) {
            console.error('Error updating user metadata:', updateError);
          }
        }
        
        // แสดงข้อความสำเร็จ
        if (messageContainer) {
          messageContainer.textContent = 'เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนเส้นทาง...';
        }
        
        // รอสักครู่แล้วเปลี่ยนเส้นทางไปหน้าหลัก
        setTimeout(() => {
          window.location.href = window.location.origin + '/index.html';
        }, 1500);
      } else {
        // ถ้าไม่มี session ให้กลับไปหน้าล็อกอิน
        window.location.href = window.location.origin + '/login.html';
      }
    } catch (error) {
      console.error('Error handling auth callback:', error);
      
      // แสดงข้อความผิดพลาด
      if (messageContainer) {
        messageContainer.textContent = 'เกิดข้อผิดพลาดในการตรวจสอบการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
      }
      
      // รอสักครู่แล้วกลับไปหน้าล็อกอิน
      setTimeout(() => {
        window.location.href = window.location.origin + '/login.html';
      }, 3000);
    }
  });