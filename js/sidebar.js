// js/sidebar.js
document.addEventListener('DOMContentLoaded', async function() {
    // โหลด Sidebar
    await loadSidebar();
    
    // เพิ่ม Toggle Button ในแต่ละหน้า
    addSidebarToggleButton();
    
    // จัดการ Sidebar UI และ Events หลังจากโหลดเสร็จ
    initSidebarEvents();
    
    // ตรวจสอบสถานะการล็อกอิน และอัปเดต UI ของ Sidebar
    await updateSidebarAuthUI();
    
    // ตั้งค่า Active Link ตามหน้าปัจจุบัน
    setActiveLink();
  });
  
  // โหลด Sidebar จากไฟล์ sidebar.html
  async function loadSidebar() {
    try {
      // ตรวจสอบว่ามี sidebar แล้วหรือไม่
      if (document.getElementById('sidebar')) {
        return;
      }
      
      // Fetch sidebar.html
      const response = await fetch('sidebar.html');
      if (!response.ok) {
        throw new Error(`Failed to load sidebar: ${response.status} ${response.statusText}`);
      }
      
      const sidebarHtml = await response.text();
      
      // เพิ่ม sidebar เข้าไปในหน้า
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = sidebarHtml;
      
      // แทรก Sidebar ลงในตำแหน่งที่เหมาะสม (ก่อนองค์ประกอบแรกของ body)
      document.body.insertBefore(tempContainer, document.body.firstChild);
      
      // แยก Sidebar ออกจาก container
      const sidebar = document.getElementById('sidebar');
      document.body.insertBefore(sidebar, document.body.firstChild);
      
      // ลบ container ชั่วคราว
      document.body.removeChild(tempContainer);
      
      // เพิ่ม wrapper div สำหรับทั้งหน้า
      wrapPageContent();
    } catch (error) {
      console.error('Error loading sidebar:', error);
    }
  }
  
  // สร้าง wrapper สำหรับเนื้อหาหลักทั้งหมด
  function wrapPageContent() {
    // ตรวจสอบว่ามี wrapper แล้วหรือไม่
    if (document.getElementById('page-content')) {
      return;
    }
    
    // สร้าง wrapper div
    const pageWrapper = document.createElement('div');
    pageWrapper.id = 'page-content';
    pageWrapper.className = 'transition-all duration-300 ease-in-out';
    
    // ย้ายทุก element ยกเว้น sidebar ไปยัง wrapper
    const sidebar = document.getElementById('sidebar');
    const bodyChildren = Array.from(document.body.children);
    
    bodyChildren.forEach(child => {
      if (child !== sidebar && child.id !== 'page-content') {
        pageWrapper.appendChild(child);
      }
    });
    
    // แทรก wrapper เข้าไปใน body
    document.body.appendChild(pageWrapper);
  }
  
  // เพิ่มปุ่ม Toggle Sidebar ใน Navbar
  function addSidebarToggleButton() {
    // หา Navbar หรือองค์ประกอบที่เหมาะสมสำหรับใส่ปุ่ม
    const navbarLogo = document.querySelector('nav a.font-bold');
    
    if (navbarLogo) {
      // สร้างปุ่ม Hamburger
      const toggleButton = document.createElement('button');
      toggleButton.id = 'sidebar-toggle';
      toggleButton.className = 'mr-3 text-blue-600 hover:text-blue-800 transition-colors focus:outline-none';
      toggleButton.setAttribute('aria-label', 'Toggle sidebar');
      toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      `;
      
      // แทรกปุ่มก่อน Logo
      navbarLogo.parentNode.insertBefore(toggleButton, navbarLogo);
    }
  }
  
  // จัดการการทำงานของ Sidebar
  function initSidebarEvents() {
    const sidebar = document.getElementById('sidebar');
    const pageContent = document.getElementById('page-content');
    const toggleButton = document.getElementById('sidebar-toggle');
    const closeButton = document.getElementById('close-sidebar');
    
    // Toggle Sidebar
    if (toggleButton) {
      toggleButton.addEventListener('click', function() {
        toggleSidebar();
      });
    }
    
    // ปิด Sidebar เมื่อคลิกที่ Close Button
    if (closeButton) {
      closeButton.addEventListener('click', closeSidebar);
    }
    
    // ปิด Sidebar เมื่อกดปุ่ม Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    });
  }
  
  // ฟังก์ชัน Toggle Sidebar
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const pageContent = document.getElementById('page-content');
    
    if (sidebar.classList.contains('-translate-x-full')) {
      // เปิด Sidebar
      sidebar.classList.remove('-translate-x-full');
      
      // ดัน content ไปทางขวา - ลดขนาดลงเหลือ 240px (ml-60)
      pageContent.classList.add('ml-60');
      
      // เพิ่มคลาสสำหรับ responsive
      adjustForResponsive(true);
    } else {
      // ปิด Sidebar
      closeSidebar();
    }
  }
  
  // ฟังก์ชันปิด Sidebar
  function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const pageContent = document.getElementById('page-content');
    
    if (!sidebar.classList.contains('-translate-x-full')) {
      sidebar.classList.add('-translate-x-full');
      pageContent.classList.remove('ml-60');
      
      // ปรับ responsive กลับ
      adjustForResponsive(false);
    }
  }
  
  // ปรับแต่ง responsive
  function adjustForResponsive(isSidebarOpen) {
    const pageContent = document.getElementById('page-content');
    
    if (isSidebarOpen) {
      // เพิ่มคลาสเฉพาะอุปกรณ์ขนาดเล็ก
      if (window.innerWidth < 768) {
        pageContent.classList.add('md:ml-60');
        pageContent.classList.add('opacity-50', 'md:opacity-100');
      }
    } else {
      // ลบคลาสทั้งหมด
      pageContent.classList.remove('md:ml-60');
      pageContent.classList.remove('opacity-50', 'md:opacity-100');
    }
  }
  
  // อัปเดต UI ของ Sidebar ตามสถานะการล็อกอิน
  async function updateSidebarAuthUI() {
    try {
      // ตรวจสอบสถานะการล็อกอิน
      const { data: { user } } = await supabase.auth.getUser();
      
      const authenticatedSection = document.getElementById('sidebar-user-authenticated');
      const guestSection = document.getElementById('sidebar-user-guest');
      const newPostMenuItem = document.getElementById('sidebar-new-post-menu-item');
      const myPostsMenuItem = document.getElementById('sidebar-my-posts');
      
      if (user) {
        // ผู้ใช้ล็อกอินแล้ว
        authenticatedSection.classList.remove('hidden');
        guestSection.classList.add('hidden');
        newPostMenuItem.classList.remove('hidden');
        myPostsMenuItem.classList.remove('hidden');
        
        // อัปเดตข้อมูลผู้ใช้
        const displayName = user.user_metadata?.display_name || user.email;
        document.getElementById('sidebar-user-name').textContent = displayName;
        
        // ตรวจสอบรูปโปรไฟล์
        if (user.user_metadata?.avatar_url) {
          document.getElementById('sidebar-user-avatar').src = user.user_metadata.avatar_url;
        }
        
        // Event listener สำหรับปุ่มล็อกเอาต์ใน Sidebar
        document.getElementById('sidebar-logout-btn').addEventListener('click', async () => {
          const { error } = await supabase.auth.signOut();
          if (!error) {
            window.location.reload();
          }
        });
      } else {
        // ผู้ใช้ยังไม่ได้ล็อกอิน
        authenticatedSection.classList.add('hidden');
        guestSection.classList.remove('hidden');
        newPostMenuItem.classList.add('hidden');
        myPostsMenuItem.classList.add('hidden');
      }
    } catch (error) {
      console.error('Error updating sidebar auth UI:', error);
    }
  }
  
  // ตั้งค่า Active Link ตามหน้าปัจจุบัน
  function setActiveLink() {
    // ดึงตำแหน่งปัจจุบันของหน้า
    const currentPath = window.location.pathname;
    
    // หา Link ทั้งหมดใน Sidebar
    const sidebarLinks = document.querySelectorAll('#sidebar nav a');
    
    // วนลูปเพื่อเช็คและตั้งค่า Active Link
    sidebarLinks.forEach(link => {
      // ดึง pathname ของ link
      const linkPath = new URL(link.href, window.location.origin).pathname;
      
      // เช็คว่าตรงกับหน้าปัจจุบันหรือไม่
      if (currentPath === linkPath || 
          (currentPath === '/' && linkPath.endsWith('index.html')) || 
          (currentPath.endsWith('index.html') && linkPath === '/')) {
        // เพิ่ม Class สำหรับ Active Link
        link.classList.add('bg-blue-50', 'text-blue-600', 'font-medium');
        // เปลี่ยนสีไอคอน
        const icon = link.querySelector('svg');
        if (icon) {
          icon.classList.remove('text-gray-400');
          icon.classList.add('text-blue-500');
        }
      }
    });
  }
  
  // เพิ่ม event listener สำหรับ responsive
  window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    
    if (!sidebar.classList.contains('-translate-x-full')) {
      adjustForResponsive(true);
    }
  });