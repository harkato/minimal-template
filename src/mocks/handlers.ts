import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8080/msh/spc/v1/tools', () =>
    HttpResponse.json([
      {
        toolId: 1,
        revision: 9,
        toolName: 'PER040',
        toolAlias: 'PER040',
        insertId: 449,
        ip: '172.23.1.47',
        mac: '',
        deviceNumber: 0,
        protocolID: 0,
        stationCode: 0,
        modelID: 4,
        servoSerialNumber: '',
        toolSerialNumber: '042219021',
        spindles: 1,
        stationID: null,
        userID: null,
        insertDate: '2022-09-29T08:30:14.313',
        configStr: '',
        toolGroup: 0,
        state: 1,
      },
      {
        toolId: 2,
        revision: 16,
        toolName: 'PER008',
        toolAlias: '',
        insertId: 400,
        ip: '172.23.1.48',
        mac: '',
        deviceNumber: 0,
        protocolID: 0,
        stationCode: 0,
        modelID: 12,
        servoSerialNumber: '',
        toolSerialNumber: '5831247',
        spindles: 1,
        stationID: null,
        userID: null,
        insertDate: '2022-09-13T09:30:51.66',
        configStr: '',
        toolGroup: 0,
        state: 1,
      },
    ])
  ),
];

export const server = setupServer(...handlers);
