 <script>
    // Mock database - In a real app, this would be API calls to your backend
    const mockUsers = [
      { 
        id: 1, 
        name: "João Silva", 
        email: "joao@empresa.com", 
        password: "123456", 
        role: "Colaborador",
        department: "TI",
        avatar: "JS"
      },
      { 
        id: 2, 
        name: "Maria Souza", 
        email: "maria@empresa.com", 
        password: "123456", 
        role: "Gerente",
        department: "RH",
        avatar: "MS"
      },
      { 
        id: 3, 
        name: "Admin", 
        email: "admin@empresa.com", 
        password: "123456", 
        role: "Administrador",
        department: "TI",
        avatar: "AD"
      }
    ];

    let timeEntries = [
      { 
        id: 1, 
        user_id: 1, 
        date: new Date().toISOString().split('T')[0], 
        entry_time: null, 
        lunch_start: null, 
        lunch_end: null, 
        exit_time: null 
      },
      { 
        id: 2, 
        user_id: 1, 
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
        entry_time: new Date(Date.now() - 86400000 + 8*3600000).toISOString(), 
        lunch_start: new Date(Date.now() - 86400000 + 12*3600000).toISOString(), 
        lunch_end: new Date(Date.now() - 86400000 + 13*3600000).toISOString(), 
        exit_time: new Date(Date.now() - 86400000 + 17*3600000).toISOString() 
      }
    ];

    // DOM Elements
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const userSection = document.getElementById('userSection');
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.getElementById('registerBtn');
    const registerBtnText = document.getElementById('registerBtnText');
    const refreshBtn = document.getElementById('refreshBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const currentDate = document.getElementById('currentDate');
    const currentDateTime = document.getElementById('currentDateTime');
    const greetingText = document.getElementById('greetingText');
    const recordsList = document.getElementById('recordsList');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    const toastClose = document.getElementById('toastClose');

    // Time display elements
    const entryTimeEl = document.getElementById('entryTime');
    const lunchStartTimeEl = document.getElementById('lunchStartTime');
    const lunchEndTimeEl = document.getElementById('lunchEndTime');
    const exitTimeEl = document.getElementById('exitTime');
    const workedHoursEl = document.getElementById('workedHours');
    const lunchDurationEl = document.getElementById('lunchDuration');
    const remainingHoursEl = document.getElementById('remainingHours');

    // Current user
    let currentUser = null;
    let currentEntry = null;
    let timeUpdateInterval = null;

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      // Format current date
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      currentDate.textContent = new Date().toLocaleDateString('pt-BR', options);
      
      // Start clock
      updateClock();
      timeUpdateInterval = setInterval(updateClock, 1000);
      
      // Add event listeners
      toastClose.addEventListener('click', hideToast);
    });

    // Update clock function
    function updateClock() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      currentDateTime.textContent = `${dateString} • ${timeString}`;
      
      // Update greeting based on time of day
      const hour = now.getHours();
      if (hour < 12) {
        greetingText.textContent = 'Bom dia,';
      } else if (hour < 18) {
        greetingText.textContent = 'Boa tarde,';
      } else {
        greetingText.textContent = 'Boa noite,';
      }
      
      if (currentUser) {
        greetingText.textContent += ` ${currentUser.name.split(' ')[0]}`;
      }
    }

    // Login Form Submission
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Entrando...';
      
      // Mock authentication - in a real app, this would be an API call
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          currentUser = user;
          showDashboard();
          showToast('Login realizado', `Bem-vindo(a), ${user.name.split(' ')[0]}!`, 'success');
        } else {
          showToast('Falha no login', 'E-mail ou senha incorretos', 'error');
        }
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Entrar';
      }, 1000);
    });

    // Register Time
    registerBtn.addEventListener('click', () => {
      if (!currentUser) return;
      
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      // Find or create today's entry
      let entry = timeEntries.find(e => e.user_id === currentUser.id && e.date === today);
      
      if (!entry) {
        entry = { 
          id: timeEntries.length + 1, 
          user_id: currentUser.id, 
          date: today, 
          entry_time: null, 
          lunch_start: null, 
          lunch_end: null, 
          exit_time: null 
        };
        timeEntries.push(entry);
      }
      
      // Determine which time to update
      if (!entry.entry_time) {
        entry.entry_time = now;
        updateRegisterButton('lunch-start');
        showToast('Registro de ponto', 'Entrada registrada com sucesso!', 'success');
      } else if (!entry.lunch_start) {
        entry.lunch_start = now;
        updateRegisterButton('lunch-end');
        showToast('Registro de ponto', 'Início de almoço registrado!', 'success');
      } else if (!entry.lunch_end) {
        entry.lunch_end = now;
        updateRegisterButton('exit');
        showToast('Registro de ponto', 'Fim de almoço registrado!', 'success');
      } else if (!entry.exit_time) {
        entry.exit_time = now;
        updateRegisterButton('completed');
        showToast('Registro de ponto', 'Saída registrada. Bom descanso!', 'success');
      }
      
      currentEntry = entry;
      updateTimeDisplay();
      updateTimeSummary();
      loadRecentRecords();
    });

    // Refresh Records
    refreshBtn.addEventListener('click', () => {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      setTimeout(() => {
        loadRecentRecords();
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        showToast('Atualização', 'Registros atualizados com sucesso', 'info');
      }, 800);
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
      showToast('Logout', 'Você saiu do sistema', 'info');
      setTimeout(() => {
        currentUser = null;
        showLogin();
      }, 1000);
    });

    // Helper Functions
    function showDashboard() {
      loginSection.classList.add('hidden');
      userSection.classList.remove('hidden');
      dashboardSection.classList.remove('hidden');
      
      userName.textContent = currentUser.name;
      userRole.textContent = currentUser.role;
      loadRecentRecords();
      updateTimeDisplay();
      updateTimeSummary();
      updateRegisterButton();
      updateClock();
    }

    function showLogin() {
      loginSection.classList.remove('hidden');
      userSection.classList.add('hidden');
      dashboardSection.classList.add('hidden');
      loginForm.reset();
    }

    function updateTimeDisplay() {
      const today = new Date().toISOString().split('T')[0];
      const entry = timeEntries.find(e => e.user_id === currentUser.id && e.date === today) || {};
      
      entryTimeEl.textContent = formatTime(entry.entry_time);
      lunchStartTimeEl.textContent = formatTime(entry.lunch_start);
      lunchEndTimeEl.textContent = formatTime(entry.lunch_end);
      exitTimeEl.textContent = formatTime(entry.exit_time);
    }

    function updateTimeSummary() {
      const today = new Date().toISOString().split('T')[0];
      const entry = timeEntries.find(e => e.user_id === currentUser.id && e.date === today) || {};
      
      // Calculate times
      let workedHours = 0;
      let lunchDuration = 0;
      let remainingHours = 8; // Default workday is 8 hours
      
      if (entry.entry_time) {
        const now = new Date();
        const entryDate = new Date(entry.entry_time);
        
        if (entry.exit_time) {
          // Day is complete
          const exitDate = new Date(entry.exit_time);
          workedHours = (exitDate - entryDate) / (1000 * 60 * 60);
          
          if (entry.lunch_start && entry.lunch_end) {
            const lunchStart = new Date(entry.lunch_start);
            const lunchEnd = new Date(entry.lunch_end);
            lunchDuration = (lunchEnd - lunchStart) / (1000 * 60 * 60);
            workedHours -= lunchDuration;
          }
          
          remainingHours = 0;
        } else if (entry.lunch_end) {
          // After lunch
          const lunchEnd = new Date(entry.lunch_end);
          workedHours = (lunchEnd - entryDate) / (1000 * 60 * 60);
          remainingHours = Math.max(0, 8 - workedHours);
          
          if (entry.lunch_start) {
            const lunchStart = new Date(entry.lunch_start);
            lunchDuration = (lunchEnd - lunchStart) / (1000 * 60 * 60);
            workedHours -= lunchDuration;
          }
        } else if (entry.lunch_start) {
          // During lunch
          const lunchStart = new Date(entry.lunch_start);
          workedHours = (lunchStart - entryDate) / (1000 * 60 * 60);
          remainingHours = Math.max(0, 8 - workedHours);
        } else {
          // Before lunch
          workedHours = (now - entryDate) / (1000 * 60 * 60);
          remainingHours = Math.max(0, 8 - workedHours);
        }
      }
      
      // Update display
      workedHoursEl.textContent = `${Math.round(workedHours * 10) / 10}h`;
      lunchDurationEl.textContent = `${Math.round(lunchDuration * 10) / 10}h`;
      remainingHoursEl.textContent = `${Math.round(remainingHours * 10) / 10}h`;
    }

    function updateRegisterButton(state) {
      if (!currentUser) return;
      
      const today = new Date().toISOString().split('T')[0];
      const entry = timeEntries.find(e => e.user_id === currentUser.id && e.date === today) || {};
      
      // Determine button state if not explicitly provided
      if (!state) {
        if (!entry.entry_time) {
          state = 'entry';
        } else if (!entry.lunch_start) {
          state = 'lunch-start';
        } else if (!entry.lunch_end) {
          state = 'lunch-end';
        } else if (!entry.exit_time) {
          state = 'exit';
        } else {
          state = 'completed';
        }
      }
      
      // Update button based on state
      registerBtn.className = 'w-full text-white py-3 px-4 rounded-lg font-semibold shadow-md smooth-transition text-lg flex items-center justify-center';
      
      switch(state) {
        case 'entry':
          registerBtnText.textContent = 'Bater Entrada';
          registerBtn.className += ' bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800';
          registerBtn.disabled = false;
          break;
        case 'lunch-start':
          registerBtnText.textContent = 'Iniciar Intervalo';
          registerBtn.className += ' bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
          registerBtn.disabled = false;
          break;
        case 'lunch-end':
          registerBtnText.textContent = 'Finalizar Intervalo';
          registerBtn.className += ' bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700';
          registerBtn.disabled = false;
          break;
        case 'exit':
          registerBtnText.textContent = 'Bater Saída';
          registerBtn.className += ' bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
          registerBtn.disabled = false;
          break;
        case 'completed':
          registerBtnText.textContent = 'Dia Completo';
          registerBtn.className += ' bg-gray-400 cursor-not-allowed';
          registerBtn.disabled = true;
          break;
      }
    }

    function loadRecentRecords() {
      if (!currentUser) return;
      
      // Get last 5 entries for the user
      const userEntries = timeEntries
        .filter(e => e.user_id === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      
      recordsList.innerHTML = '';
      
      if (userEntries.length === 0) {
        recordsList.innerHTML = `
          <div class="text-center text-gray-500 py-4">
            <i class="far fa-clock text-2xl mb-2"></i>
            <p>Nenhum registro encontrado</p>
          </div>
        `;
        return;
      }
      
      userEntries.forEach(entry => {
        const recordEl = document.createElement('div');
        recordEl.className = 'bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-primary-100 smooth-transition';
        
        const dateEl = document.createElement('div');
        dateEl.className = 'font-semibold text-gray-700 mb-2 flex justify-between items-center';
        
        const dateText = document.createElement('span');
        dateText.textContent = new Date(entry.date).toLocaleDateString('pt-BR', { 
          weekday: 'short', 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
        
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'text-xs px-2 py-1 rounded-full ' + 
          (entry.exit_time ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800');
        statusIndicator.textContent = entry.exit_time ? 'Completo' : 'Pendente';
        
        dateEl.appendChild(dateText);
        dateEl.appendChild(statusIndicator);
        
        const timesEl = document.createElement('div');
        timesEl.className = 'grid grid-cols-4 gap-2 text-sm';
        
        timesEl.innerHTML = `
          <div class="text-center">
            <div class="text-xs text-gray-500 mb-1">Entrada</div>
            <div class="font-medium ${entry.entry_time ? 'text-primary-600' : 'text-gray-400'}">${formatTime(entry.entry_time)}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-gray-500 mb-1">Início Almoço</div>
            <div class="font-medium ${entry.lunch_start ? 'text-primary-600' : 'text-gray-400'}">${formatTime(entry.lunch_start)}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-gray-500 mb-1">Fim Almoço</div>
            <div class="font-medium ${entry.lunch_end ? 'text-primary-600' : 'text-gray-400'}">${formatTime(entry.lunch_end)}</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-gray-500 mb-1">Saída</div>
            <div class="font-medium ${entry.exit_time ? 'text-primary-600' : 'text-gray-400'}">${formatTime(entry.exit_time)}</div>
          </div>
        `;
        
        recordEl.appendChild(dateEl);
        recordEl.appendChild(timesEl);
        recordsList.appendChild(recordEl);
      });
    }

    function formatTime(isoString) {
      if (!isoString) return '--:--';
      const date = new Date(isoString);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function showToast(title, message, type = 'info') {
      // Set icon and color based on type
      toast.className = 'fixed bottom-4 right-4 px-5 py-3 rounded-lg shadow-lg transform translate-y-10 opacity-0 transition-all duration-300 flex items-start max-w-xs z-50';
      
      switch(type) {
        case 'success':
          toast.className += ' bg-green-50 border border-green-100 text-green-800';
          toastIcon.innerHTML = '<i class="fas fa-check-circle text-green-500"></i>';
          break;
        case 'error':
          toast.className += ' bg-red-50 border border-red-100 text-red-800';
          toastIcon.innerHTML = '<i class="fas fa-exclamation-circle text-red-500"></i>';
          break;
        case 'info':
          toast.className += ' bg-blue-50 border border-blue-100 text-blue-800';
          toastIcon.innerHTML = '<i class="fas fa-info-circle text-blue-500"></i>';
          break;
        default:
          toast.className += ' bg-gray-50 border border-gray-100 text-gray-800';
          toastIcon.innerHTML = '<i class="fas fa-info-circle text-gray-500"></i>';
      }
      
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      
      toast.classList.remove('hidden');
      toast.classList.remove('translate-y-10', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      
      // Auto-hide after 5 seconds
      setTimeout(hideToast, 5000);
    }

    function hideToast() {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }
  </script>
</body>
</html>
