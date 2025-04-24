document.addEventListener('DOMContentLoaded', function() {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid || typeof projectsData === 'undefined') return;

  function tagToClass(tag) {
    // Map tag names to color classes for pills
    const map = {
      'Computer Vision': 'computer-vision',
      'Machine Learning': 'machine-learning',
      'Deep Sea': 'deep-sea',
      'Hydrothermal Vents': 'hydrothermal',
      'Data Visualization': 'data-viz',
      'Bioinformatics': 'bioinformatics',
      'Climate Science': 'climate',
      'Ecology': 'ecology',
      'Quality Assurance': 'computer-vision', // fallback to gray
      'Embedded Systems': 'computer-vision', // fallback to gray
      'Taxonomy': 'machine-learning', // fallback to purple
      'Biodiversity': 'ecology',
      'Time Series': 'data-viz',
      'Biochemistry': 'bioinformatics',
      'Biotechnology': 'ecology',
      'Pharmacology': 'climate',
      'Ecological Modeling': 'ecology',
      'Conservation': 'ecology',
      'Genomics': 'bioinformatics',
      'Extremophiles': 'deep-sea',
      'Education': 'data-viz',
      'Community Science': 'ecology',
      'Natural Language Processing': 'machine-learning',
      'Scientific Writing': 'machine-learning',
      'Literature Analysis': 'machine-learning',
      'Acoustic Ecology': 'deep-sea',
      'Signal Processing': 'machine-learning',
      'Bioacoustics': 'deep-sea',
      'Image Processing': 'computer-vision',
      'Geochemistry': 'hydrothermal',
      'Microbiology': 'bioinformatics',
      '3D Modeling': 'data-viz',
      'Photogrammetry': 'data-viz',
    };
    return map[tag] || '';
  }

  // Generate a deterministic hash code from a string
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function createProjectCard(project) {
    const a = document.createElement('a');
    a.href = project.link || '#';
    a.style.textDecoration = 'none';

    const article = document.createElement('article');
    article.className = 'article-wrapper';

    const imgDiv = document.createElement('div');
    imgDiv.className = 'rounded-lg container-project';
    imgDiv.style.backgroundImage = `url('${project.image}')`;
    imgDiv.style.backgroundSize = 'cover';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'project-info';

    const flexDiv = document.createElement('div');
    flexDiv.className = 'flex-pr';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'project-title text-nowrap';
    titleDiv.textContent = project.title;

    const hoverDiv = document.createElement('div');
    hoverDiv.className = 'project-hover';
    hoverDiv.innerHTML = `<svg style="color: var(--primary);" xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><line y2="12" x2="19" y1="12" x1="5"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

    flexDiv.appendChild(titleDiv);
    flexDiv.appendChild(hoverDiv);

    const descP = document.createElement('p');
    descP.className = 'project-description';
    descP.textContent = project.description;

    const typesDiv = document.createElement('div');
    typesDiv.className = 'types';
    project.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'project-type tag-pill';
      span.textContent = `• ${tag}`;
      const hue = hashCode(tag) % 360;
      span.style.backgroundColor = `hsl(${hue}, 50%, 90%)`;
      span.style.color = `hsl(${hue}, 50%, 30%)`;
      typesDiv.appendChild(span);
    });

    infoDiv.appendChild(flexDiv);
    infoDiv.appendChild(descP);
    infoDiv.appendChild(typesDiv);

    article.appendChild(imgDiv);
    article.appendChild(infoDiv);
    a.appendChild(article);
    return a;
  }

  // Clear and render all projects
  projectsGrid.innerHTML = '';
  projectsData.forEach(project => {
    projectsGrid.appendChild(createProjectCard(project));
  });

  // --- Search and Tag Filter Logic ---
  const searchInput = document.getElementById('project-search');
  const searchBtn = document.getElementById('search-btn');
  const resultsCount = document.getElementById('results-count');
  const activeFilters = document.getElementById('active-filters');
  const tagPills = document.querySelectorAll('.popular-tags .tag-pill');

  let activeFilterTags = new Set();

  function getCardData(card) {
    const title = card.querySelector('.project-title').textContent.toLowerCase();
    const description = card.querySelector('.project-description').textContent.toLowerCase();
    const cardTags = Array.from(card.querySelectorAll('.project-type')).map(tag => tag.textContent.toLowerCase().replace('•', '').trim());
    return { title, description, cardTags };
  }

  function createActiveFilterTag(tag) {
    const filterTag = document.createElement('div');
    filterTag.className = 'active-filter-tag';
    filterTag.dataset.tag = tag;
    // Copy color class from pill
    const pill = Array.from(tagPills).find(p => p.dataset.tag === tag);
    if (pill) {
      const colorClass = Array.from(pill.classList).find(cls => cls !== 'tag-pill' && cls !== 'active');
      if (colorClass) filterTag.classList.add(colorClass);
    }
    filterTag.innerHTML = `${tag}<span class="remove-filter">×</span>`;
    filterTag.querySelector('.remove-filter').addEventListener('click', function(e) {
      e.stopPropagation();
      removeFilter(tag);
    });
    return filterTag;
  }

  function addFilter(tag) {
    if (!activeFilterTags.has(tag)) {
      activeFilterTags.add(tag);
      activeFilters.appendChild(createActiveFilterTag(tag));
      applyFilters();
    }
  }

  function removeFilter(tag) {
    activeFilterTags.delete(tag);
    const tagElement = document.querySelector(`.active-filter-tag[data-tag="${tag}"]`);
    if (tagElement) tagElement.remove();
    // Remove active class from pill
    const pill = document.querySelector(`.popular-tags .tag-pill[data-tag="${tag}"]`);
    if (pill) pill.classList.remove('active');
    applyFilters();
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    let visibleProjects = 0;
    // Remove existing "no results" message
    const existingNoResults = document.querySelector('.no-results');
    if (existingNoResults) existingNoResults.remove();
    const cards = Array.from(projectsGrid.querySelectorAll('.article-wrapper')).map(card => card.closest('a'));
    cards.forEach(cardLink => {
      const card = cardLink.querySelector('.article-wrapper');
      const { title, description, cardTags } = getCardData(card);
      const matchesSearch = searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm) || cardTags.some(tag => tag.includes(searchTerm));
      let matchesFilters = true;
      if (activeFilterTags.size > 0) {
        matchesFilters = Array.from(activeFilterTags).every(filterTag => cardTags.some(tag => tag === filterTag.toLowerCase()));
      }
      if (matchesSearch && matchesFilters) {
        cardLink.style.display = '';
        visibleProjects++;
      } else {
        cardLink.style.display = 'none';
      }
    });
    resultsCount.textContent = visibleProjects;
    if (visibleProjects === 0) {
      const noResultsElement = document.createElement('div');
      noResultsElement.className = 'no-results';
      noResultsElement.innerHTML = 'No projects found matching your criteria.<br>Try different filters or clear your search.';
      projectsGrid.appendChild(noResultsElement);
    }
  }

  searchInput.addEventListener('input', applyFilters);
  searchBtn.addEventListener('click', function(e) { e.preventDefault(); applyFilters(); });
  tagPills.forEach(pill => {
    pill.addEventListener('click', function(e) {
      e.stopPropagation();
      const tag = this.getAttribute('data-tag');
      this.classList.toggle('active');
      if (this.classList.contains('active')) {
        addFilter(tag);
      } else {
        removeFilter(tag);
      }
    });
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      activeFilterTags.clear();
      activeFilters.innerHTML = '';
      tagPills.forEach(pill => pill.classList.remove('active'));
      applyFilters();
    }
  });
  // Initial count
  applyFilters();
});
