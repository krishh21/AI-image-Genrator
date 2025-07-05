// Dark/Light mode toggle
const toggleBtn = document.querySelector('.theme-toggle');
toggleBtn.addEventListener('click', () => {
  const body = document.body;
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');

  const icon = toggleBtn.querySelector('i');
  if (body.classList.contains('dark-theme')) {
    icon.classList.replace('fa-sun', 'fa-moon');
  } else {
    icon.classList.replace('fa-moon', 'fa-sun');
  }
});

// Handle generate
const form = document.querySelector('.prompt-form');
const promptInput = document.querySelector('.prompt.input');
const selects = document.querySelectorAll('.custom-select');
const results = document.getElementById('image-results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const prompt = promptInput.value.trim();
  const model = selects[0].value;
  const count = Number(selects[1].value);
  const aspect = selects[2].value;

  if (!prompt || !model || !count || !aspect) {
    alert('Please fill out all fields.');
    return;
  }

  results.innerHTML = '';

  // Add placeholders
  for (let i = 0; i < count; i++) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('image-placeholder');
    placeholder.textContent = 'Generating...';
    results.appendChild(placeholder);
  }

  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, count, aspect })
    });

    if (!response.ok) {
      throw new Error('Server error');
    }

    const data = await response.json();

    if (data.images && data.images.length > 0) {
      data.images.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        results.replaceChild(img, results.children[index]);
      });
    } else {
      // No images returned — show friendly message
      results.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const errorMsg = document.createElement('div');
        errorMsg.classList.add('image-placeholder');
        errorMsg.textContent = '❌ Unable to generate image. Please try again!';
        results.appendChild(errorMsg);
      }
    }
  } catch (err) {
    console.error(err);
    results.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const errorMsg = document.createElement('div');
      errorMsg.classList.add('image-placeholder');
      errorMsg.textContent = '❌ Unable to generate image. Please try again!';
      results.appendChild(errorMsg);
    }
  }
});
