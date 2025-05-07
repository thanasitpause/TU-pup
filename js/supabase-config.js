// supabase-config.js
const supabaseUrl = 'https://ntdzzbkplgjipkbykzmb.supabase.co'; // ใส่ Project URL ของคุณ
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50ZHp6YmtwbGdqaXBrYnlrem1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTQxMDAsImV4cCI6MjA2MTY5MDEwMH0.yrvXGzujPa5MYi7pK-Cnu3HO_NoPWI92hBJnTqr23_4'; // ใส่ anon key ของคุณ
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ตรวจสอบสถานะการล็อกอิน
const checkAuth = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return user;
    } else {
      // ถ้าไม่ได้ล็อกอิน และไม่ได้อยู่ในหน้าล็อกอิน/ลงทะเบียน
      const currentPage = window.location.pathname;
      if (!currentPage.includes('login.html') && !currentPage.includes('register.html')) {
        window.location.href = 'login.html';
      }
      return null;
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    return null;
  }
};

// เปลี่ยน Timestamp เป็นรูปแบบที่อ่านง่าย
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `${diffDay} วันที่แล้ว`;
  } else if (diffHour > 0) {
    return `${diffHour} ชั่วโมงที่แล้ว`;
  } else if (diffMin > 0) {
    return `${diffMin} นาทีที่แล้ว`;
  } else {
    return 'เมื่อสักครู่';
  }
};

// อัปโหลดรูปภาพไปยัง Supabase Storage
const uploadImage = async (file, folder) => {
  try {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// สร้าง Function เพิ่มจำนวนความคิดเห็น (ต้องสร้างใน Supabase ด้วย)
const createIncrementFunction = async () => {
  // ฟังก์ชันว่าง เนื่องจากเราสร้าง function และ trigger ใน Database แล้ว
};

const incrementCommentCount = async (postId) => {
  try {
    const { error } = await supabase.rpc('update_comment_count', { post_id_param: postId });

    if (error) {
      console.error('Error updating comment count:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in incrementCommentCount:', error);
    return false;
  }
};

// ส่งออกฟังก์ชัน
window.supabase = supabase;
window.checkAuth = checkAuth;
window.formatTimestamp = formatTimestamp;
window.uploadImage = uploadImage;
window.incrementCommentCount = incrementCommentCount; // เพิ่มบรรทัดนี้