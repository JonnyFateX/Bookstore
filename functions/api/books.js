import { fakerEN, fakerDE, fakerNL } from '@faker-js/faker';

export async function onRequestPost(context){
    const data = await context.request.json()
    const amount = data["amount"]
    const seed = data["seed"]
    const language = data["language"]
    const likes = data["likes"]
    const reviews = data["reviews"]

    if(!amount || !seed || !language || !likes || !reviews){
        return Response.json({
            error: "Specify amount, seed, language, likes and reviews."
        })
    }

    let faker
    if(language === "English"){
        faker = fakerEN
    }else if(language === "German"){
        faker = fakerDE
    }else if(language === "Dutch"){
        faker = fakerNL
    }else{
        faker = fakerEN
    }

    const books = []
    faker.seed(seed)
    for(let i = 0; i < parseInt(amount); i++){
        books.push({
            title: faker.book.title({ language: "ES"}),
            isbn: faker.commerce.isbn(),
            authors: getAuthors(faker),
            publisher: faker.book.publisher(),
            likes: faker.number.int({ min: 0, max: parseInt(likes)}),
            reviews: getReviews(faker, reviews),
            img: faker.image.urlPicsumPhotos({
                blur: 0,
                height: 220,
                width: 130
            })
        })
    }
    return Response.json({
        books: books
    })
}

function getAuthors(faker){
    const number = faker.number.int({ min: 1, max: 3})
    const authors = []
    for(let i = 0; i < number; i++){
        authors.push(faker.book.author())
    }
    return authors.join(", ")
}

function getReviews(faker, numOfReviews){
    const reviews = []
    for(let i = 0; i < parseInt(numOfReviews); i++){
        let preComment = faker.word.words({
            count: {
                min: 3,
                max: 10
            }
        })
        const comment = preComment.charAt(0).toUpperCase() + preComment.slice(1)
        reviews.push({
            comment: comment,
            author: faker.person.fullName()
        })
    }
    return reviews
}