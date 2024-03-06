const loadAI = () => {
  const URL = `https://openapi.programming-hero.com/api/retro-forum/posts`;
  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      data.posts.forEach((post) => {
        const newsCard = document.createElement("div");
        newsCard.classList.add("news-card");

        if (post.isActive) {
          newsCard.classList.add("bg-gray-200");
        }
        newsCard.innerHTML = `
          <div class="flex flex-col lg:flex-row border mb-3 lg:gap-8 py-2 lg:rounded-xl px-4">
            <img src="${post.image}" class="w-16 h-16 lg:w-16 lg:h-16 rounded-full" alt="" />
            <div class="mt-2 lg:mt-0">
              <div class="flex flex-col lg:flex-row lg:gap-3">
                <p class="font-semibold">#<span>${post.category}</span></p>
                <p class="font-semibold">Author:${post?.author?.name}</p>
              </div>
              <h2 class="text-3xl font-bold mb-2">${post.title}</h2>
              <p>${post.description}</p>
              <div class="border-t border-dotted border-gray-400 my-4"></div>
              <div class="flex justify-between">
                <div class="flex lg:flex-row flex-col gap-4">
                  <span class="flex items-center gap-3">
                    <i class="far fa-eye"></i>
                    <span>${post.view_count}</span>
                  </span>
                  <span class="flex items-center gap-3">
                    <i class="far fa-comment"></i>
                    <span>${post.comment_count}</span>
                  </span>
                  <span class="flex items-center gap-3">
                    <i class="far fa-clock"></i>
                    <span>${post.posted_time} min</span>
                  </span>
                </div>
                <span id="message" class="p-1 rounded-full bg-green-500">
                  <i class="far fa-envelope-open"></i>
                </span>
              </div>
            </div>
          </div>
        `;

        document.getElementById("news-container").appendChild(newsCard);
      });

      const messageIcon = document.getElementById("message");
      messageIcon.addEventListener("click", showMessage);
    })
    .catch((err) => console.log(err));
};

const showMessage = (event) => {
  const newsCard = event.target.closest(".news-card");

  const title = newsCard.querySelector("h2").textContent;
  const viewCount = newsCard.querySelector(".fa-eye + span").textContent;

  let newsTable = document.getElementById("news-table");
  if (!newsTable) {
    newsTable = document.createElement("div");
    newsTable.id = "news-table";
    document.body.appendChild(newsTable);
  }

  newsTable.innerHTML += `
    <div class="p-4 bg-gray-200 rounded-lg">
      <table class="table">
        <thead>
          <tr>
            <th class="text-xl text-black">Title</th>
            <th class="text-black">View Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-xl">${title}</td>
            <td>${viewCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

loadAI();

const fetchLatestPosts = async () => {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/retro-forum/latest-posts"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return []; // return an empty array in case of error
  }
};

const generatePostHTML = (post) => {
  return `
 <div class="card w-96 bg-gray-200 shadow-xl">
  <figure class="px-10 pt-10">
    <img src="${post.cover_image}" alt="Cover Image" class="rounded-xl" />
  </figure>
  <div class="card-body items-center mb-2">
      <div class="flex gap-3 items-center">
    <i class="fas fa-calendar-alt"></i>
    <p>${post?.author?.posted_date || "No publish date"}</p>
      </div>

    <div>
    <h2 class="font-bold text-xl mb-2">${post?.title}</h2>
        <p class="text-gray-700 text-base">${post?.description}</p>
    </div>
   
     <div class="flex items-center my-3 gap-4">
          <img class="size-16 rounded-full border-4 border-white object-cover mr-4" src="${
            post.profile_image
          }" alt="Profile Image">
          <div>
            <div class="font-bold text-xl">${post?.author?.name}</div>
            <div class="text-gray-500">${
              post?.author?.designation || "Unknown"
            }</div>
            
          </div>
        </div>
  </div>
</div>
  `;
};

async function renderPosts() {
  const dynamicDiv = document.getElementById("dynamic");

  const latestPosts = await fetchLatestPosts();

  latestPosts.forEach((post) => {
    const postHTML = generatePostHTML(post);
    dynamicDiv.insertAdjacentHTML("beforeend", postHTML);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
});
