/**
 * EcoGold Authentication System
 * Sliding Login & Register with Green, White & Gold theme
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const authContainer = document.getElementById('authContainer');
  const signUpBtn = document.getElementById('signUp');
  const signInBtn = document.getElementById('signIn');
  const tabSignIn = document.getElementById('tabSignIn');
  const tabSignUp = document.getElementById('tabSignUp');

  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const forgotForm = document.getElementById('forgotForm');

  const forgotModal = document.getElementById('forgotModal');
  const btnForgotPassword = document.getElementById('btnForgotPassword');
  const closeForgotModal = document.getElementById('closeForgotModal');

  const regPasswordInput = document.getElementById('regPassword');
  const strengthContainer = document.getElementById('strengthContainer');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');

  // Initialize Demo Account in LocalStorage if not exists
  initLocalStorage();

  // Handle Mobile Initial Display State
  updateMobileDisplay(false);

  // =========================================================================
  // 1. SLIDING / PANEL SWITCHING LOGIC
  // =========================================================================

  // Desktop slider trigger: Switch to Sign Up
  if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
      switchToSignUp();
    });
  }

  // Desktop slider trigger: Switch to Sign In
  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      switchToSignIn();
    });
  }

  // Mobile tab triggers
  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => {
      switchToSignIn();
    });

    tabSignUp.addEventListener('click', () => {
      switchToSignUp();
    });
  }

  function switchToSignUp() {
    authContainer.classList.add('right-panel-active');
    updateMobileDisplay(true);
    if (tabSignUp && tabSignIn) {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
    }
  }

  function switchToSignIn() {
    authContainer.classList.remove('right-panel-active');
    updateMobileDisplay(false);
    if (tabSignIn && tabSignUp) {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
    }
  }

  function updateMobileDisplay(isSignUp) {
    const signInContainer = document.querySelector('.sign-in-container');
    const signUpContainer = document.querySelector('.sign-up-container');
    if (window.innerWidth <= 868) {
      if (isSignUp) {
        signInContainer.classList.remove('active-mobile');
        signUpContainer.classList.add('active-mobile');
      } else {
        signUpContainer.classList.remove('active-mobile');
        signInContainer.classList.add('active-mobile');
      }
    } else {
      signInContainer.classList.remove('active-mobile');
      signUpContainer.classList.remove('active-mobile');
    }
  }

  window.addEventListener('resize', () => {
    const isSignUp = authContainer.classList.contains('right-panel-active');
    updateMobileDisplay(isSignUp);
  });

  // =========================================================================
  // 2. PASSWORD VISIBILITY TOGGLE
  // =========================================================================
  const togglePwdButtons = document.querySelectorAll('.toggle-pwd');
  togglePwdButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (!targetInput) return;

      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        btn.classList.remove('fa-eye');
        btn.classList.add('fa-eye-slash');
      } else {
        targetInput.type = 'password';
        btn.classList.remove('fa-eye-slash');
        btn.classList.add('fa-eye');
      }
    });
  });

  // =========================================================================
  // 3. PASSWORD STRENGTH METER (GREEN & GOLD ACCENTS)
  // =========================================================================
  if (regPasswordInput && strengthContainer && strengthFill && strengthText) {
    regPasswordInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!val) {
        strengthContainer.classList.remove('active');
        return;
      }

      strengthContainer.classList.add('active');
      const strength = evaluatePasswordStrength(val);

      strengthFill.style.width = strength.percent + '%';
      strengthFill.style.backgroundColor = strength.color;
      strengthText.textContent = `Độ an toàn: ${strength.label}`;
      strengthText.style.color = strength.color;
    });
  }

  function evaluatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        return { percent: 25, label: 'Rất yếu', color: '#ef4444' };
      case 2:
        return { percent: 50, label: 'Trung bình', color: '#f59e0b' }; // Gold
      case 3:
      case 4:
        return { percent: 75, label: 'Khá mạnh', color: '#10b981' }; // Green
      case 5:
        return { percent: 100, label: 'Rất an toàn', color: '#047857' }; // Dark Green
      default:
        return { percent: 20, label: 'Yếu', color: '#ef4444' };
    }
  }

  // =========================================================================
  // 4. FORM VALIDATION & SIGN UP PROCESSING
  // =========================================================================
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const termsChecked = document.getElementById('regTerms').checked;

    let hasError = false;

    // Reset error messages
    clearErrors(['regNameError', 'regEmailError', 'regPasswordError', 'regConfirmPasswordError', 'regTermsError']);

    // Validate Name
    if (!name) {
      setError('regNameError', 'Vui lòng nhập họ và tên của bạn.');
      hasError = true;
    } else if (name.length < 2) {
      setError('regNameError', 'Họ tên phải có ít nhất 2 ký tự.');
      hasError = true;
    }

    // Validate Email
    if (!email) {
      setError('regEmailError', 'Vui lòng nhập địa chỉ email.');
      hasError = true;
    } else if (!isValidEmail(email)) {
      setError('regEmailError', 'Định dạng email không hợp lệ.');
      hasError = true;
    }

    // Validate Password
    if (!password) {
      setError('regPasswordError', 'Vui lòng nhập mật khẩu.');
      hasError = true;
    } else if (password.length < 6) {
      setError('regPasswordError', 'Mật khẩu phải có ít nhất 6 ký tự.');
      hasError = true;
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      setError('regConfirmPasswordError', 'Vui lòng xác nhận lại mật khẩu.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setError('regConfirmPasswordError', 'Mật khẩu xác nhận không khớp.');
      hasError = true;
    }

    // Validate Terms
    if (!termsChecked) {
      setError('regTermsError', 'Bạn cần đồng ý với Điều khoản & Chính sách để tiếp tục.');
      hasError = true;
    }

    if (hasError) return;

    // Check if account already exists
    const users = JSON.parse(localStorage.getItem('ecogold_users') || '[]');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setError('regEmailError', 'Email này đã được đăng ký tài khoản!');
      showToast('Đăng Ký Thất Bại', 'Email này đã tồn tại trong hệ thống. Vui lòng đăng nhập.', 'warning');
      return;
    }

    // Save new user
    const newUser = {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('ecogold_users', JSON.stringify(users));

    // Show toast
    showToast('Đăng Ký Thành Công! 🎉', 'Tài khoản của bạn đã được tạo. Đang chuyển sang đăng nhập...', 'success');

    // Fill registered email into login form
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = '';

    // Reset register form
    signUpForm.reset();
    strengthContainer.classList.remove('active');

    // Slide back to Sign In
    setTimeout(() => {
      switchToSignIn();
      document.getElementById('loginPassword').focus();
    }, 1200);
  });

  // =========================================================================
  // 5. SIGN IN PROCESSING
  // =========================================================================
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    clearErrors(['loginEmailError', 'loginPasswordError']);
    let hasError = false;

    if (!email) {
      setError('loginEmailError', 'Vui lòng nhập email hoặc tài khoản.');
      hasError = true;
    }

    if (!password) {
      setError('loginPasswordError', 'Vui lòng nhập mật khẩu của bạn.');
      hasError = true;
    }

    if (hasError) return;

    // Verify credentials
    const users = JSON.parse(localStorage.getItem('ecogold_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      setError('loginPasswordError', 'Tài khoản hoặc mật khẩu không chính xác.');
      showToast('Đăng Nhập Thất Bại', 'Email hoặc mật khẩu không khớp với hệ thống.', 'error');
      return;
    }

    // Success login
    showToast('Đăng Nhập Thành Công! 🌟', `Chào mừng ${user.name} đã quay trở lại với EcoGold!`, 'success');

    // Add visual login success state
    const submitBtn = document.getElementById('btnSignInSubmit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã Xác Thực';
      submitBtn.style.background = 'linear-gradient(135deg, #059669, #047857)';
    }, 1000);

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3500);
  });

  // =========================================================================
  // 6. FORGOT PASSWORD MODAL
  // =========================================================================
  if (btnForgotPassword && forgotModal && closeForgotModal) {
    btnForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.classList.add('active');
      const forgotEmailInput = document.getElementById('forgotEmail');
      const loginEmail = document.getElementById('loginEmail').value.trim();
      if (loginEmail) forgotEmailInput.value = loginEmail;
      forgotEmailInput.focus();
    });

    closeForgotModal.addEventListener('click', () => {
      forgotModal.classList.remove('active');
    });

    forgotModal.addEventListener('click', (e) => {
      if (e.target === forgotModal) {
        forgotModal.classList.remove('active');
      }
    });

    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail').value.trim();
      if (!isValidEmail(email)) {
        showToast('Email Không Hợp Lệ', 'Vui lòng nhập định dạng email chính xác.', 'warning');
        return;
      }

      showToast('Đã Gửi Hướng Dẫn! 📧', `Liên kết đặt lại mật khẩu đã được gửi tới ${email}. Vui lòng kiểm tra hộp thư.`, 'success');
      forgotForm.reset();
      forgotModal.classList.remove('active');
    });
  }

  // =========================================================================
  // 7. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Auto remove after 3.8s
    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, 3800);
  }

  // =========================================================================
  // 8. HELPER FUNCTIONS
  // =========================================================================
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function setError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
  }

  function clearErrors(ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  function initLocalStorage() {
    const existing = localStorage.getItem('ecogold_users');
    if (!existing) {
      const demoUsers = [
        {
          name: 'Demo User',
          email: 'demo@ecogold.vn',
          password: '123456',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('ecogold_users', JSON.stringify(demoUsers));
    }
  }
});
