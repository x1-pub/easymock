import {cloneDeep} from 'lodash';

export const schemaType = [
  'String',
  'Number',
  'Boolean',
  'Object',
  'Array',
  'Date',
  'Faker.js',
  'Object ID',
  'Parent ID',
];

export const FakerType = [
  {
    title: 'date',
    children: [
      'recent',
      'birthdate',
      'future',
      'month',
      'soon',
      'weekday',
    ],
  },
  {
    title: 'name',
    children: [
      'firstName',
      'fullName',
      'gender',
      'jobArea',
      'jobDescriptor',
      'jobTitle',
      'jobType',
      'lastName',
      'middleName',
      'prefix',
      'sex',
      'sexType',
      'suffix',
    ],
  },
  {
    title: 'phone',
    children: [
      'imei',
      'number',
      'phoneFormats',
      'phoneNumber',
      'phoneNumberFormat',
    ],
  },
  {
    title: 'datatype',
    children: [
      'array',
      'bigInt',
      'boolean',
      'datetime',
      'float',
      'hexadecimal',
      'json',
      'number',
      'string',
      'uuid',
    ],
  },
  {
    title: 'address',
    children: [
      'buildingNumber',
      'cardinalDirection',
      'city',
      'cityName',
      'cityPrefix',
      'citySuffix',
      'country',
      'countryCode',
      'county',
      'direction',
      'latitude',
      'longitude',
      'nearbyGPSCoordinate',
      'ordinalDirection',
      'secondaryAddress',
      'state',
      'stateAbbr',
      'street',
      'streetAddress',
      'streetName',
      'streetPrefix',
      'streetSuffix',
      'timeZone',
      'zipCode',
      'zipCodeByState',
    ],
  },
  {
    title: 'lorem',
    children: [
      'lines',
      'paragraph',
      'paragraphs',
      'sentence',
      'sentences',
      'slug',
      'text',
      'word',
      'words',
    ],
  },
  {
    title: 'mersenne',
    children: [
      'rand',
      'seed',
      'seed_array',
    ],
  },
  {
    title: 'music',
    children: [
      'genre',
      'songName',
    ],
  },
  {
    title: 'finance',
    children: [
      'account',
      'accountName',
      'amount',
      'bic',
      'bitcoinAddress',
      'creditCardCVV',
      'creditCardIssuer',
      'creditCardNumber',
      'currencyCode',
      'currencyName',
      'currencySymbol',
      'ethereumAddress',
      'iban',
      'litecoinAddress',
      'mask',
      'pin',
      'routingNumber',
      'transactionDescription',
      'transactionType',
    ],
  },
  {
    title: 'animal',
    children: [
      'bear',
      'bird',
      'cat',
      'cetacean',
      'cow',
      'crocodilia',
      'dog',
      'fish',
      'horse',
      'insect',
      'lion',
      'rabbit',
      'rodent',
      'snake',
      'type',
    ],
  },
  {
    title: 'git',
    children: [
      'branch',
      'commitEntry',
      'commitMessage',
      'commitSha',
      'shortSha',
    ],
  },
  // {
  //   title: '',
  //   children: [

  //   ],
  // },
  // {
  //   title: '',
  //   children: [

  //   ],
  // },
];

export const schemaTemplet = JSON.stringify(
    {
      'code': 1,
      'name': '{{internet.userName}}',
      'ips': ['{{internet.ip}}', '{{internet.ipv6}}'],
      'profile': {
        'lastName': '{{name.lastName}}',
        'staticData': 100,
      },
    },
    null,
    2,
);

export const mockDataTemplet = JSON.stringify(
    {
      'list': '{{mockData}}',
      'count': '{{count}}',
      'ip': '{{internet.ip}}',
      'staticData': 'hello world',
    },
    null,
    2,
);

const defaultEP = [
  {
    method: 'GET',
    enable: 1,
    delay: 0,
    response: '{{mockData}}',
    url: 'noId',
  },
  {
    method: 'GET',
    enable: 1,
    delay: 0,
    response: '{{mockData}}',
    url: 'withId',
  },
  {
    method: 'POST',
    enable: 1,
    delay: 0,
    response: '{{mockData}}',
    url: 'noId',
  },
  {
    method: 'PUT',
    enable: 1,
    delay: 0,
    response: '{{mockData}}',
    url: 'withId',
  },
  {
    method: 'DELETE',
    enable: 1,
    delay: 0,
    response: '{{mockData}}',
    url: 'withId',
  },
];
export const getEndpoints = (
    name = '...',
    pUrl = '',
    ep = defaultEP,
) => {
  let withId;
  let noId;
  if (pUrl) {
    withId = `${pUrl}/${name}/:id`;
    noId = `${pUrl}/${name}`;
  } else {
    withId = `/${name}/:id`;
    noId = `/${name}`;
  }
  const epc = cloneDeep(ep);

  epc[0].url = noId;
  epc[1].url = withId;
  epc[2].url = noId;
  epc[3].url = withId;
  epc[4].url = withId;

  return epc;
};


const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      const obj=JSON.parse(str);
      if (typeof obj == 'object' && obj ) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

export const validator = async (form) => new Promise((resolve, reject) => {
  // name
  if (!/^[0-9a-zA-Z_]{1,16}/.test(form?.name)) {
    reject(new Error('请输入1-16位由字母、数字或下划线组成的资源名称'));
  }
  // schema array
  form?.schemas?.forEach((item) => {
    if (!/^[0-9a-zA-Z_]{1,16}/.test(item.name)) {
      reject(new Error('请输入1-16位由字母、数字或下划线组成的Schema字段名'));
    }
  });
  // Object template
  if (form?.generator && !isJSON(form?.generator)) {
    reject(new Error('Object template应为位JSON对象'));
  }
  // Endpoints
  form?.endpoints.forEach((item) => {
    if (item.response !== '{{mockData}}' && !isJSON(item.response)) {
      reject(new Error('Endpoints的响应数据应为{{mockData}}或JSON对象'));
    }
  });
  resolve();
});
