const { data, error: loginError } = await supabase.auth.signInWithPassword({
  email: session.data.session.user.email,
  password: current
});

if (loginError) {
  alert("รหัสผ่านเดิมไม่ถูกต้อง");
  return;
}

const fileInput = document.getElementById('profile-picture');
const preview = document.getElementById('preview');

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '#';
    preview.style.display = 'none';
  }
});

async function uploadAvatar(file) {
  const user = supabase.auth.user();
  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
  if (uploadError) {
    console.error('Upload Error:', uploadError);
    return;
  }

  const { publicURL, error } = supabase.storage.from('avatars').getPublicUrl(filePath);
  if (error) {
    console.error('Public URL error:', error);
    return;
  }

  return publicURL;
}

