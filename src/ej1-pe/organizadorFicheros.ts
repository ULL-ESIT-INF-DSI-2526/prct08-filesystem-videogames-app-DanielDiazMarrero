import fs from 'fs';
import path from 'path';

class OrganizadorFicheros {
  
  /**
   * Función para organizar un directorio en carpetas por extensiones
   * @param dirName - Nombre del directorio a organizar
   */
  public organize(dirName: string): void {

    // Comprobamos qu eexista el directorio
    if (!fs.existsSync(dirName)) throw new Error("No existe el directorio");

    const extensions: string[] = [];
    
    // Guardamos los ficheros y directorios
    const filesDirs = fs.readdirSync(dirName, { withFileTypes: true });

    // Cogemos solo los ficheros
    const files = filesDirs.filter(f => f.isFile()).map(f => f.name)
    
    files.forEach(f => {
      if(!extensions.includes(path.extname(f))) {  // Si no tenemos guardada la extension, la añadimos
        extensions.push(path.extname(f));
      }
    })

    // Creamos los directorios de las extensiones
    extensions.forEach(extension => {
      if (!fs.existsSync(extension)) fs.mkdirSync(path.join(dirName, extension));
    })

    // Iteramos cada extension
    for (let i = 0; i < extensions.length; i++) {

      // Cogemos todos los ficheros con la misma extension
      const ficheros: string[] = files.filter((f: string) => f.endsWith(extensions[i]))
      
      // Movemos los ficheros a la carpeta de su extensión
      ficheros.forEach(file => {
        fs.renameSync(path.join(dirName, file), path.resolve(dirName, extensions[i], file));
      })
    }
  }

  /**
   * Función para eliminar duplicados de un directorio 
   * (NO tiene en cuenta la extension y 
   * elimina todos los duplicados menos el primero con ese nombre)
   * @param dirName - Nombre dle directorio
   */
  public deleteDuplicates(dirName: string): void {
    // Comprobamos qu eexista el directorio
    if (!fs.existsSync(dirName)) throw new Error("No existe el directorio");

    // Cogemos todos los ficheros del directorio
    const files: string[] = fs.readdirSync(dirName);

    // Map para guadar tamaño y nombre con la ruta
    let fileStats = new Map();

    files.forEach(file => {
        const pathfile = path.join(dirName, file);

        // Cogemos el nombre sin l aextnsion
        const archivo: string = path.parse(file).name;

        // Tamaño 
        const stats = fs.statSync(pathfile);
        const size = stats.size;

        // clave del map
        const key = `${archivo}-${size}`

        if(fileStats.has(key)) {  // Si ya hay uno igual en el map se borra el actual
          console.log(`Se elimina el fichero ${file}`);
          fs.unlinkSync(pathfile);

        } else {

            // Metemos clave y ruta
          fileStats.set(key, pathfile);
        }
    })

    const ficheros: string[] = fs.readdirSync(dirName);
  }

  /**
   * Funcion para renombrar todos los ficheros de un directorio con un prefijo
   * @param dirName - Nombre del directorio
   * @param prefix - Prefijo a implementar
   */
  public renameFiles(dirName: string, prefix: string): void {
    // Comprobamos qu eexista el directorio
    if (!fs.existsSync(dirName)) throw new Error("No existe el directorio");

    // Guardamos los ficheros y directorios
    const filesDirs = fs.readdirSync(dirName, { withFileTypes: true });

    // Cogemos solo los ficheros
    const files = filesDirs.filter(f => f.isFile()).map(f => f.name);

    files.forEach(file => {

      // Añadimos prefijo
      const newName: string = `${prefix}_${file}`;

      // Cambiamos la ruta con el nuevo prefijo
      fs.renameSync(path.join(dirName, file), path.join(dirName, newName));
    })
  }
}

const organizer = new OrganizadorFicheros();

console.log("\n ----------- ORGANIZA DIRECTORIO ----------- \n");
//organizer.organize(path.join('src', 'testing'));

console.log("\n ----------- ELIMINA DUPLICADOS ----------- \n");
organizer.deleteDuplicates("./src/testing");

console.log("\n ----------- RENOMBRAMOS DIRECTORIO ----------- \n");
organizer.renameFiles("./src/testing", "alu");