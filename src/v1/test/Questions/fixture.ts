export const questionCreate = {
  validInsertQuestion: {
    name: '3+2?',
    description: 'This is Question 1, asking to add 3 apples and 2 apples horizontally.',
    tenant_id: 5,
    tenant_board_id: 7,
    class_id: 2,
    repository_id: 8,
    type: 'mcq',
    l1_skill: 'Addition',
    l2_skill: '2D',
    l3_skill: 'Horizontal addition',
    sub_skills: [
      {
        wrong_answer: ['6'],
        sub_skill: '<subskill_id>',
      },
    ],
    answer: '5',
    prerequisites: [
      {
        type: 'l1_skill',
        id: '001',
      },
      {
        type: 'l2_skill',
        id: '001',
      },
    ],
    benchmark_time: 240,
    hints: ['Start with Smaller Numbers', 'Group the Objects'],
    solutions: [
      {
        step: 1,
        description: 'Count the first group of 3 apples.',
      },
      {
        step: 2,
        description: 'Count the second group of 2 apples.',
      },
      {
        step: 3,
        description: 'Add the two groups together: 3 + 2 = 5.',
      },
    ],
    gradient: 'gx',
    rubrics: 'Correctly adding objects to get the total.',
    version: '1',
    media: [
      {
        mime_type: 'image/png',
        src: 'apples_addition.png',
        base_url: 'https://example.com/media/',
        type: 'image',
        id: '<uuid>',
      },
    ],
    i18n: [
      {
        code: 'ka',
        value: 'kannada value',
      },
    ],
    created_by: 1,
  },

  inValidSchemaQuestion: {
    name: '3+2?',
    description: 'This is Question 1, asking to add 3 apples and 2 apples horizontally.',
    tenant_id: 5,
    tenant_board_id: 7,
    class_id: 2,
    repository_id: 8,
    type: 'mcq',
    l1_skill: 'Addition',
    l2_skill: '2D',
    l3_skill: 'Horizontal addition',
    created_by: 1,
  },
  invalidInsertTypeQuestion: {
    name: 123,
    description: 'This is Question 1, asking to add 3 apples and 2 apples horizontally.',
    tenant_id: 'Q',
    tenant_board_id: 7,
    class_id: 2,
    repository_id: 8,
    type: 'mcq',
    l1_skill: 'Addition',
    l2_skill: '2D',
    l3_skill: 'Horizontal addition',
    sub_skills: [
      {
        wrong_answer: ['6'],
        sub_skill: '<subskill_id>',
      },
    ],
    answer: '5',
    prerequisites: [
      {
        type: 'l1_skill',
        id: '001',
      },
      {
        type: 'l2_skill',
        id: '001',
      },
    ],
    benchmark_time: 240,
    hints: ['Start with Smaller Numbers', 'Group the Objects'],
    solutions: [
      {
        step: 1,
        description: 'Count the first group of 3 apples.',
      },
      {
        step: 2,
        description: 'Count the second group of 2 apples.',
      },
      {
        step: 3,
        description: 'Add the two groups together: 3 + 2 = 5.',
      },
    ],
    gradient: 'gx',
    rubrics: 'Correctly adding objects to get the total.',
    version: '1',
    media: [
      {
        mime_type: 'image/png',
        src: 'apples_addition.png',
        base_url: 'https://example.com/media/',
        type: 'image',
        id: '<uuid>',
      },
    ],
    i18n: [
      {
        code: 'ka',
        value: 'kannada value',
      },
    ],
    created_by: 1,
  },
};

export const questionUpdate = {
  validUpdateQuestion: {
    question: {
      title: 'What is 7 + 8?',
      updated_by: 12345,
    },
  },
  invalidUpdateQuestion: {
    id: 123456,
    title: '5+6?',
    gradient: 'G3',
    created_by: 1,
  },
};
