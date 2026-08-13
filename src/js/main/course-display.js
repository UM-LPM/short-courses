!function (e, t) {
    "function" == typeof define && define.amd ? define([], function () { return t(e); }) :
        "object" == typeof exports ? module.exports = t(e) :
            e.courseDisplay = t(e);
}("undefined" != typeof global ? global : this.window || this.global, function (e) {
    "use strict";

    function fetchAndDisplayCourses() {
        fetch('course-data.json')
            .then(response => response.json())
            .then(data => {

                data = data.filter(course => {
                    const now = new Date();

                    const publishDate = course.publishDate ? new Date(course.publishDate) : null;
                    const removalDate = course.removalDate ? new Date(course.removalDate) : null;

                    if (!publishDate || publishDate > now) return false;
                    if (removalDate && removalDate <= now) return false;

                    return true;
                });

                let coursesWithDate = [];
                let coursesWithoutDate = [];

                const now = new Date();

                data.forEach(course => {
                    if (course.unparsedExecutionStartDate) {
                        const localDate = new Date(course.unparsedExecutionStartDate);

                        if (localDate >= now) {
                            course.executionStartDate = formatLocalDate(course.unparsedExecutionStartDate);
                            course.executionEndDate = formatLocalDate(course.unparsedExecutionEndDate);
                            coursesWithDate.push(course);
                        } else {
                            coursesWithoutDate.push(course);
                        }
                    } else {
                        coursesWithoutDate.push(course);
                    }
                });

                coursesWithDate.sort(
                    (a, b) =>
                        new Date(a.unparsedExecutionStartDate) -
                        new Date(b.unparsedExecutionStartDate)
                );

                const seed = getSeed();
                const shuffledOthers = shuffleWithSeed(coursesWithoutDate, seed);

                const finalCourses = [...coursesWithDate, ...shuffledOthers];

                const gridElement = document.getElementById('grid');
                gridElement.innerHTML = '';

                finalCourses.forEach(course => {
                    const courseElement = createCourseElement(course);
                    gridElement.appendChild(courseElement);
                });
            })
            .catch(error => console.error('Error loading course data:', error));
    }

    function shuffleWithSeed(array, seed) {
        let m = array.length, t, i;

        while (m) {
            i = Math.floor(random(seed) * m--);

            t = array[m];
            array[m] = array[i];
            array[i] = t;

            ++seed;
        }
        return array;
    }

    function random(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function getSeed() {
        let seed = localStorage.getItem('courseShuffleSeed');
        if (!seed) {
            seed = Math.floor(Math.random() * 1000000);
            localStorage.setItem('courseShuffleSeed', seed);
        }
        return parseInt(seed, 10);
    }

    function formatLocalDate(dateString) {
        if (!dateString) return null;
        const d = new Date(dateString);
        return d.toLocaleString([], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function createCourseElement(course) {
        const article = document.createElement("article");
        article.style.opacity = 1;
        article.className = "box-item";

        const keywordsArray = course.keywords
            ? course.keywords.split(", ").map(k => k.trim())
            : [];
        const keywordsEnArray = course.keywordsEn
            ? course.keywordsEn.split(", ").map(k => k.trim())
            : [];

        const title = course.title ?? "";
        const titleEn = course.titleEn || title;
        const authors = course.lecturersStrSl ?? "";
        const authorsEn = course.lecturersStrEn || authors;
        const description = course.descriptionSl ?? "";
        const descriptionEn = course.descriptionEn || description;
        const startDate = course.executionStartDate;
        const endDate = course.executionEndDate;

        // Render both languages; html.lang-sl / html.lang-en CSS decides which is visible
        const bilingual = (sl, en) =>
            sl === en ? sl : `<span data-sl>${sl}</span><span data-en>${en}</span>`;

        const datesString =
            startDate && endDate ? `${startDate} - ${endDate}` : "";

        const imageUrl = course.image
            ? `${course.image}/512/${course.acronym}.png`
            : "/assets/img/placeholder.png";

        const keywordTagsHtml = keywordsArray
            .map((tag, i) =>
                `<a href="/tags/#${tag.toLowerCase().replace(/ /g, "-")}" class="tag">${bilingual('#' + tag, '#' + (keywordsEnArray[i] || tag))}</a>`
            )
            .join(" ");

        const imageAlt = title.replace(/"/g, "&quot;");

        const datesHtml = datesString
            ? `<h3 class="course-dates" style="margin-top:0;">${datesString}</h3>`
            : "";

        const authorsHtml = authors
            ? `<h3 class="course-author" style="margin-top:0;">${bilingual(authors, authorsEn)}</h3>`
            : "";

        article.innerHTML = `
    <span class="category"><span>${bilingual(title, titleEn)}</span></span>
    <div class="box-body">
      <a class="cover" href="${course.url}">
        <img src="${imageUrl}" alt="${imageAlt}" width="100%" class="preload">
        <noscript><img src="/assets/img/off.jpg" alt="${imageAlt}" width="100%"></noscript>
        <div class="read-icon">
          <svg><use xlink:href="#icon-read"></use></svg>
        </div>
      </a>

      <div class="box-info">
        <a class="course-link" href="${course.url}">
          ${datesHtml}
          ${authorsHtml}
          <p class="description">${bilingual(shortenDescription(description), shortenDescription(descriptionEn))}</p>
        </a>

        <div class="tags">${keywordTagsHtml}</div>
      </div>
    </div>
  `;

        return article;
    }

    function shortenDescription(description) {
        if (!description) return "";
        const words = description.split(" ");
        return words.length > 20 ? words.slice(0, 20).join(" ") + "..." : description;
    }

    return {
        init: function () {
            document.addEventListener('DOMContentLoaded', fetchAndDisplayCourses);
        }
    };
});

!function () {
    var isMainPage = window.location.pathname === '/' || window.location.pathname === '/home.html';

    if (isMainPage && "undefined" != typeof courseDisplay) {
        courseDisplay.init();
    }
}();