const Repository = require("./repository");
const { bind, bindOut, DbType } = require("../../../database/oracle");

class SolicitudRepository extends Repository {
  async create(solicitud) {
    let result = { ...solicitud };

    let output = await this.storedProcedure("gocash.add_solicitud", [
      solicitud.idProyecto,
      solicitud.idUsuarioCoordinador,
      solicitud.idEstado,
      solicitud.idTipoSolicitud,
      bindOut(DbType.Number), // id_solicitud
    ]);

    result.idSolicitud = output.outBinds[0];
    result.cuadrillas = await this.createCuadrillas(result.idSolicitud, solicitud.cuadrillas);
    //result.idUsuarioTecnico = await this.read(idUsuarioResponsable);

    return result;
  }

  async createCuadrillas(idSolicitud, cuadrillas) {
    let tasks = [],
      i = 1,
      result = [];

    cuadrillas.forEach((c) => {
      tasks.push(
        this.storedProcedure("gocash.add_cuadrilla", [
          c.idUsuarioTecnico,
          bind(new Date(c.fechaInicio), DbType.Date),
          bind(new Date(c.fechaFinal), DbType.Date),
          c.idVehiculo,
          c.descripcion,
          idSolicitud,
          i++,
          bindOut(DbType.Number), // id_cuadrilla
        ])
      );
    });

    let output = await Promise.all(tasks);

    i = 0;
    output.forEach((o) => {
      // copiar cuadrilla
      let cuadrilla = { ...cuadrillas[i] };
      cuadrilla.idCuadrilla = o.outBinds[0];
      result.push(cuadrilla);
      i++;
    });

    return result;
  }

  // async read(idUsuarioResponsable) {
  //   let output = await this.tableFunction("gocash.get_solicitud_pendiente", [
  //     idUsuarioResponsable,
  //   ]);
  // }
}

module.exports = new SolicitudRepository();
