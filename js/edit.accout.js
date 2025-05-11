const { data, error: loginError } = await supabase.auth.signInWithPassword({
  email: session.data.session.user.email,
  password: current
});

if (loginError) {
  alert("รหัสผ่านเดิมไม่ถูกต้อง");
  return;
}
