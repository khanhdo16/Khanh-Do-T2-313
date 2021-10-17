import faker from 'faker'

faker.seed(123)

let expertList = []

//Generate 6 experts
for(let i = 0; i < 6; i++) {
    let expert = {
        key: i,
        image: faker.internet.avatar(),
        name: faker.name.findName(),
        description: faker.name.jobTitle(),
        star: faker.datatype.number(3) + 2
    }

    expertList[i] = expert
}

export default expertList