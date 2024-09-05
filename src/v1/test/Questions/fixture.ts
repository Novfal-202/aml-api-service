export const insert_question_request = {
  questionCreate: {
    id: 'api.question.create',
    ver: '1.0',
    ts: '2021-02-02T19:28:24Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      quid: 'q0004',
      tenant: {
        id: 10,
        name: 'EkStep',
      },
      repository: {
        id: 1,
        name: 'AML',
      },
      type: 'grid',
      operation: 'division',
      name: {
        en: 'This is question for Division',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆಯಾಗಿದೆ',
        hi: 'यह प्रभाग के लिए प्रश्न है',
      },
      description: {
        en: 'This is description for the Question',
      },
      hints: {
        en: ['This is the hint for the question '],
      },
      solutions: {
        en: ['This is the solutions for the questions'],
      },
      taxonomy: {
        board: 'CBSE',
        class: 'Class-1',
        l1: 'division',
        l2: '4D',
        l3: '4D by 2D without reminder',
      },
      gradient: 'g4',
      version: '1.0',
      media: [
        {
          mediaType: 'image/png',
          mimeType: 'image',
          baseUrl: 'http://www.example.com/media',
          src: 'https://example.com/media/div.png',
        },
      ],
      body: {
        numbers: ['8012', '12'],
        showCarry: false,
        prefill: ['BB', 'FBB'],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
        wrongAnswers: [
          {
            '650,0': ['carry'],
          },
          {
            '510,10': ['pvp'],
          },
          {
            option: '650,0',
            subskill: ['x+0', 'carry'],
          },
          {
            option: '510,10',
          },
        ],
        wronganswer1: [
          {
            option: '650, 0',
            subskill: ['carry'],
            value: 0,
          },
          {
            option: '510, 10',
            subskill: ['x+0'],
            value: 0,
          },
        ],
      },
    },
  },

  invalidQuestionRequest: {
    id: 'api.question.create',
    ver: '1.0',
    ts: '2021-02-02T19:28:24Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      quid: 'q0004',
      tenant: {
        id: 10,
        name: 'EkStep',
      },
      repository: {
        id: 1,
        name: 'AML',
      },

      operation: 'division',
      name: {
        en: 'This is question for Division',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆಯಾಗಿದೆ',
        hi: 'यह प्रभाग के लिए प्रश्न है',
      },
      description: {
        en: 'This is description for the Question',
      },
      hints: {
        en: ['This is the hint for the question '],
      },
      solutions: {
        en: ['This is the solutions for the questions'],
      },
      taxonomy: {
        board: 'CBSE',
        class: 'Class-1',
        l1: 'division',
        l2: '4D',
        l3: '4D by 2D without reminder',
      },
      gradient: 'g4',
      version: '1.0',
      media: [
        {
          mediaType: 'image/png',
          mimeType: 'image',
          baseUrl: 'http://www.example.com/media',
          src: 'https://example.com/media/div.png',
        },
      ],
      body: {
        numbers: ['8012', '12'],
        showCarry: false,
        prefill: ['BB', 'FBB'],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
        wrongAnswers: [
          {
            '650,0': ['carry'],
          },
          {
            '510,10': ['pvp'],
          },
          {
            option: '650,0',
            subskill: ['x+0', 'carry'],
          },
          {
            option: '510,10',
          },
        ],
        wronganswer1: [
          {
            option: '650, 0',
            subskill: ['carry'],
            value: 0,
          },
          {
            option: '510, 10',
            subskill: ['x+0'],
            value: 0,
          },
        ],
      },
    },
  },

  invalidQuestionSchema: {
    id: 'api.question.create',
    ver: '1.0',
    ts: '2021-02-02T19:28:24Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      quid: 'q0004',
      tenant: {
        id: 10,
        name: 'EkStep',
      },
      repository: {
        id: 1,
        name: 'AML',
      },

      operation: 'division',
      name: {
        en: 'This is question for Division',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆಯಾಗಿದೆ',
        hi: 'यह प्रभाग के लिए प्रश्न है',
      },
      description: {
        en: 'This is description for the Question',
      },
      hints: {
        en: ['This is the hint for the question '],
      },
      solutions: {
        en: ['This is the solutions for the questions'],
      },
      taxonomy: {
        board: 'CBSE',
        class: 'Class-1',
        l1: 'division',
        l2: '4D',
        l3: '4D by 2D without reminder',
      },
      gradient: 4,
      version: '1.0',
      media: [
        {
          mediaType: 'image/png',
          mimeType: 'image',
          baseUrl: 'http://www.example.com/media',
          src: 'https://example.com/media/div.png',
        },
      ],
      body: {
        numbers: ['8012', '12'],
        showCarry: false,
        prefill: ['BB', 'FBB'],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
        wrongAnswers: [
          {
            '650,0': ['carry'],
          },
          {
            '510,10': ['pvp'],
          },
          {
            option: '650,0',
            subskill: ['x+0', 'carry'],
          },
          {
            option: '510,10',
          },
        ],
        wronganswer1: [
          {
            option: '650, 0',
            subskill: ['carry'],
            value: 0,
          },
          {
            option: '510, 10',
            subskill: ['x+0'],
            value: 0,
          },
        ],
      },
    },
  },
};

export const updateQuestion = {
  // Valid update request
  validQuestionUpdateRequest: {
    id: 'api.question.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      gradient: 'gi',
    },
  },

  // Invalid update request
  invalidQuestionUpdateRequest: {
    id: 'api.question.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      // Missing required fields
      updated_by: 'some_user_id',
      // Missing 'name' and 'type' which are required
    },
  },

  // Tenant does not exist
  questionNotExistsRequest: {
    id: 'api.question.update',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      gradient: 'gi',
      // Ensure this field is excluded if not in the model
      // board_id: [1, 2, 3],
    },
  },
};

export const questionSearch = {
  validQuestionSearchrequest: {
    id: 'api.question.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',
    params: {
      msgid: '123e4567-e89b-12d3-a456-426614174000',
    },
    request: {
      filters: {
        type: ['grid'],
      },
      limit: 10,
      offset: 0,
    },
  },

  invalidSchemaSearchRequest: {
    id: 'api.question.search',
    ver: '1.0',
    ts: '2024-09-03T12:34:56Z',

    request: {
      filters: {
        type: ['grid'],
      },
      limit: 10,
      offset: 0,
    },
  },
};
