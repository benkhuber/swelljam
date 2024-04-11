class BuoyReadingClass {
  constructor(currentReading, currentSpectralReading) {
    const year = currentReading[0];
    const month = currentReading[1];
    const day = currentReading[2];
    const hour = currentReading[3];
    const minute = currentReading[4];

    const utcDate = `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;

    this.readingDate = new Date(utcDate);
    this.significantWaveHeight = currentReading[8];
    this.averageWavePeriod = currentReading[10];
    this.meanWaveDirection = currentReading[11];
    this.dominantWavePeriod = currentReading[9];
    this.waterTemperature = currentReading[14];

    this.swellHeight = currentSpectralReading[6];
    this.swellPeriod = currentSpectralReading[7];
    this.swellDirection = currentSpectralReading[10];
    this.windWaveHeight = currentSpectralReading[8];
    this.windWavePeriod = currentSpectralReading[9];
    this.windWaveDirection = currentSpectralReading[11];
  }
}

export default BuoyReadingClass;
