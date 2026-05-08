/** ID da playlist YouTube com as 26 aulas de Cirurgia. */
export const PLAYLIST_ID = 'PLE0NmHF9nlUASUm_qnsZWN0kkxGVUnwPy';

/**
 * Constrói uma URL do YouTube apontando para o vídeo de uma aula
 * em um segundo específico, mantendo o contexto da playlist.
 */
export function buildVideoUrl(videoId: string, startSec?: number): string {
  const base = `https://www.youtube.com/watch?v=${videoId}&list=${PLAYLIST_ID}`;
  return startSec && startSec > 0 ? `${base}&t=${startSec}s` : base;
}
