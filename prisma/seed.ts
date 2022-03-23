import { Prisma, PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

const namePool = [
  'John',
  'Jane',
  'Joe',
  'Jack',
  'Jill',
  'Jenny',
  'Jill',
  'Jenny',
  'Jack',
  'Joe',
  'Jane',
  'John',
];

// const emailPool = Array.from({ length: 20 }, () => {
//   const name = namePool[Math.floor(Math.random() * namePool.length)];
//   const domain = ['gmail.com', 'yahoo.com', 'hotmail.com'][
//     Math.floor(Math.random() * 3)
//   ];
//   return `${name}@${domain}`;
// });

//create random email function
const randomEmail = () => {
  const name =
    namePool[Math.floor(Math.random() * namePool.length)] + nanoid(5);
  const domain = ['gmail.com', 'yahoo.com', 'hotmail.com'][
    Math.floor(Math.random() * 3)
  ];
  return `${name}@${domain}`;
};

const birthdays = Array.from({ length: 20 }, () => {
  const year = Math.floor(Math.random() * 100) + 1900;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
});

const phoneNumbers = Array.from({ length: 20 }, () => {
  const areaCode = Math.floor(Math.random() * 1000);
  const first3 = Math.floor(Math.random() * 1000);
  const last4 = Math.floor(Math.random() * 1000);
  return `${areaCode}-${first3}-${last4}`;
});

const avatars = Array.from({ length: 20 }, () => {
  return `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 500)}`;
});

const linkedinUrls = Array.from({ length: 20 }, () => {
  return `https://www.linkedin.com/in/${Math.floor(Math.random() * 500)}`;
});

const introductions = Array.from({ length: 20 }, () => {
  return `${Math.floor(Math.random() * 500)}`;
});

const degrees = [
  'Bachelor',
  'Master',
  'PhD',
  'MBA',
  'M.S.',
  'M.A.',
  'M.E.',
  'M.S.',
];

const experiencesTitle = [
  'Software Engineer',
  'Manager',
  'Sales',
  'Marketing',
  'Designer',
  'Developer',
  'Product Manager',
];

const companies = [
  'Google',
  'Facebook',
  'Microsoft',
  'Apple',
  'Amazon',
  'IBM',
  'Oracle',
  'Intel',
  'Samsung',
  'Nokia',
  'Sony',
  'LG',
  'HTC',
  'Motorola',
];

const achievements = [
  'Best Developer',
  'Best Manager',
  'Best Sales',
  'Best Marketing',
  'Best Designer',
  'Best Developer',
  'Best Product Manager',
];

const skillStrings = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'MySQL',
  'HTML',
  'CSS',
  'Python',
  'Django',
  'Flask',
  'PHP',
  'Laravel',
  'Ruby',
  'Rails',
  'C#',
  'C++',
  'C',
  'Swift',
  'Objective-C',
  'Go',
  'Rust',
  'Scala',
  'Kotlin',
  'Haskell',
  'Erlang',
  'Elixir',
  'Julia',
  'Rust',
  'Elm',
  'Clojure',
  'ClojureScript',
];

const categoryString = [
  'Web Development',
  'Mobile Development',
  'Backend Development',
  'Frontend Development',
  'Fullstack Development',
  'Data Science',
  'Machine Learning',
  'Blockchain',
  'DevOps',
  'UI/UX',
  'Game Development',
  'VR/AR',
  'Robotics',
  'IoT',
  'Embedded Systems',
  'Hardware',
  'Security',
];

const createUserInput = (
  skillIds: number[],
  categoryIds: number[],
): Prisma.UserCreateInput => {
  const name = namePool[Math.floor(Math.random() * namePool.length)];
  const email = randomEmail();
  const birthdate = birthdays[Math.floor(Math.random() * birthdays.length)];
  const phoneNumber =
    phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
  const avatar = avatars[Math.floor(Math.random() * avatars.length)];
  const linkedinUrl =
    linkedinUrls[Math.floor(Math.random() * linkedinUrls.length)];
  const introduction =
    introductions[Math.floor(Math.random() * introductions.length)];
  const degree = degrees[Math.floor(Math.random() * degrees.length)];
  const experienceTitle =
    experiencesTitle[Math.floor(Math.random() * experiencesTitle.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const achievement =
    achievements[Math.floor(Math.random() * achievements.length)];
  //take 3 random skill form skillIds to array
  const rand = Math.floor(Math.random() * skillIds.length);
  const skills = skillIds.slice(rand, rand + 3);
  return {
    name,
    password: 'asdklj',
    email,
    birthday: birthdate,
    phone: phoneNumber,
    avatar,
    isActive: true,
    User_mentor: {
      create: {
        isAccepted: true,
        category: {
          connect: {
            id: categoryIds[Math.floor(Math.random() * categoryIds.length)],
          },
        },
        linkedin: linkedinUrl,
        introduction,
        degree: {
          create: {
            title: degree,
            issuer: 'test',
            startAt: birthdate,
          },
        },
        experiences: {
          create: {
            title: experienceTitle,
            company,
            startAt: birthdate,
          },
        },
        achievements: {
          create: {
            description: achievement,
          },
        },
        skills: {
          create: skills.map((skill) => ({
            skill: { connect: { id: skill } },
          })),
        },
      },
    },
  };
};

async function main() {
  // await prisma.$transaction([
  //   prisma.skill.createMany({
  //     data: skillStrings.map((skill: string) => ({ description: skill })),
  //   }),
  //   prisma.category.createMany({
  //     data: categoryString.map((category: string) => ({ name: category })),
  //   }),
  // ]);

  // await prisma.skill.createMany({
  //   data: skillStrings.map((skill: string) => ({
  //     description: skill,
  //     isAccepted: true,
  //   })),
  // });

  const skillIds = await prisma.skill.findMany({
    select: { id: true },
  });
  const categoryIds = await prisma.category.findMany({
    select: { id: true },
  });
  const sIds = skillIds.map((skill) => skill.id);
  const cIds = categoryIds.map((category) => category.id);

  const mentorCreate: Prisma.UserCreateInput[] = Array.from(
    { length: 10 },
    () => createUserInput(sIds, cIds),
  );

  const mentors = await Promise.all(
    mentorCreate.map((mentor) => {
      return prisma.user.create({ data: mentor });
    }),
  );
  console.log(mentors);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
