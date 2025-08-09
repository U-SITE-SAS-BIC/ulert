#!/usr/bin/env node
// /labs/cosmos/index.js

/**
 * Copyright 2025 u-site.app
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const { Command } = require('commander');
const chalk = require('chalk');
const boxen = require('boxen').default; 

const osint = require('./osint');
const fingerprint = require('./fingerprint');
const visualize = require('./visualize');

module.exports.run = async (target) => {
  const header = `
${chalk.cyan.bold('🚀  Ulert Cosmos™ – Escaneo Iniciado')}
${chalk.white('🔭  Objetivo:')} ${chalk.yellow(target)}
${chalk.white('📅  Fecha:')} ${chalk.green(new Date().toLocaleString())}
`;

  console.log(
    boxen(header.trim(), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'magentaBright'
    })
  );

  const osintData = await osint.run(target);
  const fingerprintData = await fingerprint.run(target, osintData);
  await visualize.generate(target, { osintData, fingerprintData });

  console.log(
    boxen(
      `
${chalk.green.bold('✅  Análisis Finalizado')}
${chalk.white('🌐  Más información en:')} ${chalk.cyan.underline('https://ulert.u-site.app')}
${chalk.magentaBright('✨ Gracias por usar Ulert Cosmos™')}
    `.trim(),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'greenBright'
      }
    )
  );

};
