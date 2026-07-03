export class SchedulerEngine {
  constructor(courses, professors, rooms) {
    this.courses = courses;       // Array de materias
    this.professors = professors; // Array de profesores
    this.rooms = rooms;           // Array de aulas
    this.days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    this.hours = ['07:00:00', '09:00:00', '11:00:00', '14:00:00', '16:00:00', '18:00:00'];
  }

  generateSchedule() {
    const assignments = [];
    const usedSlots = new Set(); // Guarda "dia-hora-id_aula" o "dia-hora-id_profesor"

    for (const course of this.courses) {
      // Heurística: Filtrar profesores que puedan dar esta materia
      // Nota: Si en tu BD aún no vinculas especialidades, puedes hacer que todos califiquen temporalmente
      const eligibleProfs = this.professors.filter(p => 
        p.especialidades ? p.especialidades.includes(course.id_materia) : true
      );

      let assigned = false;
      const shuffledProfs = [...eligibleProfs].sort(() => Math.random() - 0.5);
      const shuffledRooms = [...this.rooms].sort(() => Math.random() - 0.5);

      for (const prof of shuffledProfs) {
        if (assigned) break;

        for (const day of this.days) {
          if (assigned) break;

          for (const hour of this.hours) {
            if (assigned) break;

            for (const room of shuffledRooms) {
              const roomSlotKey = `${day}-${hour}-${room.id_aula}`;
              const profSlotKey = `${day}-${hour}-${prof.id_usuario}`;

              if (!usedSlots.has(roomSlotKey) && !usedSlots.has(profSlotKey)) {
                
                // Formateamos la hora de fin sumando 2 horas lógicas del bloque estándar
                const [h, m, s] = hour.split(':');
                const horaFin = `${String(parseInt(h) + 2).padStart(2, '0')}:${m}:${s}`;

                assignments.push({
                  id_materia: course.id_materia,
                  id_profesor: prof.id_usuario,
                  id_aula: room.id_aula,
                  dia: day,
                  hora_inicio: hour,
                  hora_fin: horaFin
                });

                usedSlots.add(roomSlotKey);
                usedSlots.add(profSlotKey);
                assigned = true;
                break;
              }
            }
          }
        }
      }
    }

    return {
      assignments,
      fitnessScore: (assignments.length / this.courses.length) * 100
    };
  }
}