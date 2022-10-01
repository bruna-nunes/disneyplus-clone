const MovieCarouselItem = (props) => {
    return `
        <li class="movie-carousel_item" data-carousel="item" data-id="${props.id}">
            <a href="/${props.slug}" class="movie-carousel_link">
                <img src="${props.imageCover}" alt="Capa do filme ${props.title}" class="movie-carousel_cover">
            </a>
        </li>
    `
}

export default MovieCarouselItem;