
const expedienteService = require('../services/expedienteService');
const dbHelper = require('../utils/dbHelper');


jest.mock('../utils/dbHelper');

describe('expedienteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('crearExpediente devuelve el id del expediente creado', async () => {

    dbHelper.executeStoredProcedure.mockResolvedValue({
      recordset: [{ IdExpedienteCreado: 123 }]
    });

    const id = await expedienteService.crearExpediente({
      numeroExpediente: 'DICRI-2025-0001',
      titulo: 'Caso de prueba',
      descripcion: 'Descripción',
      idTecnicoRegistro: 2
    });

    expect(dbHelper.executeStoredProcedure).toHaveBeenCalledWith(
      'usp_Expediente_Crear',
      expect.objectContaining({
        NumeroExpediente: 'DICRI-2025-0001'
      })
    );

    expect(id).toBe(123);
  });

  test('listarExpedientes devuelve un arreglo de expedientes', async () => {
    dbHelper.executeStoredProcedure.mockResolvedValue({
      recordset: [
        { IdExpediente: 1, NumeroExpediente: 'DICRI-2025-0001' }
      ]
    });

    const data = await expedienteService.listarExpedientes({
      fechaInicio: null,
      fechaFin: null,
      idEstadoExpediente: null,
      idTecnico: null
    });

    expect(Array.isArray(data)).toBe(true);
    expect(data[0].IdExpediente).toBe(1);
  });
});
